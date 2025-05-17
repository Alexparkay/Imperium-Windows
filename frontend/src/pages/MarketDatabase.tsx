import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useFilters } from '../contexts/FilterContext';
import { 
  MdSearch, 
  MdFilterList, 
  MdLocationOn, 
  MdFactory, 
  MdOutlineEmail, 
  MdOutlinePhone, 
  MdArrowForward, 
  MdAdd, 
  MdDelete, 
  MdEdit, 
  MdLink, 
  MdCheck, 
  MdChevronRight,
  MdFilterAlt,
  MdRefresh,
  MdOutlineRoofing,
  MdOutlineManageSearch,
  MdOutlineBusiness,
  MdSolarPower,
  MdOutlineElectricBolt,
  MdAreaChart,
  MdTrendingUp,
  MdBarChart,
  MdAttachMoney,
  MdPieChart,
  MdInsights,
  MdOutlineAnalytics,
  MdOutlineLightbulb,
  MdOutlineEnergySavingsLeaf,
  MdOutlineArrowUpward,
  MdAccessTime,
  MdOutlineCalendarMonth,
  MdOutlineSearch,
  MdOutlineLocationOn,
  MdOutlineCloud,
  MdOutlineWbSunny,
  MdKeyboardArrowRight,
  MdHomeWork,
  MdShowChart,
  MdEmail,
  MdDashboard,
  MdFilterAltOff,
  MdArrowBack,
  MdInfoOutline,
  MdStorage,
  MdComputer,
  MdDataUsage,
  MdSyncAlt,
  MdOutlineDataUsage,
  MdBusinessCenter,
  MdOutlineStarOutline,
} from 'react-icons/md';
import { toast } from 'react-hot-toast';
import { FaLinkedin, FaFilter } from 'react-icons/fa';

// Add company types
const companyTypes = [
  "Manufacturing", 
  "Distribution", 
  "Retail", 
  "Professional Services", 
  "Healthcare", 
  "Financial Services", 
  "Public Sector", 
  "Utilities", 
  "Education", 
  "Hospitality"
];

const MarketDatabase = () => {
  const navigate = useNavigate();
  const { filters, setFilter, clearFilters, activeFilterCount } = useFilters();
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false); // Change back to false to hide the table initially
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [companiesStats, setCompaniesStats] = useState({
    total: 426000, // Updated back to 426,000 as requested
    filtered: 14, 
    small: 283000,
    medium: 106500,
    large: 36500,
    enriched: 0,
    highPotential: 1964,
  });
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 230, // Make it look like we have many pages
    itemsPerPage: 10
  });

  // State options for dropdown
  const usStates = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", 
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", 
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", 
    "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", 
    "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ];

  // Industry/sector options
  const sectors = [
    "Manufacturing", "Technology", "Healthcare", "Retail", "Wholesale Distribution", "Energy", 
    "Financial Services", "Education", "Food & Beverage", "Automotive", "Electronics", 
    "Pharmaceuticals", "Logistics", "Aerospace", "Telecommunications"
  ];

  // Revenue ranges
  const revenueRanges = [
    "Under $10M annual revenue",
    "$10M - $50M annual revenue",
    "$50M - $100M annual revenue", 
    "$100M - $500M annual revenue",
    "$500M - $1B annual revenue",
    "Over $1B annual revenue"
  ];

  // ERP modules ranges
  const erpModulesRanges = [
    "Basic (FI/CO only)",
    "Standard (FI/CO, MM, SD)",
    "Advanced (FI/CO, MM, SD, PP, QM)",
    "Enterprise (Full SAP Suite)"
  ];

  // Cost ranges for filters
  const annualSpendRanges = [
    "Under $100,000",
    "$100,000 - $250,000",
    "$250,000 - $500,000",
    "$500,000 - $1,000,000",
    "$1,000,000 - $2,500,000",
    "Over $2,500,000"
  ];

  const implementationSizeRanges = [
    "Small (< 50 users)",
    "Medium (50 - 200 users)",
    "Large (200 - 500 users)",
    "Enterprise (> 500 users)"
  ];

  const dealSizeRanges = [
    "Under $250,000",
    "$250,000 - $500,000",
    "$500,000 - $1,000,000",
    "$1,000,000 - $2,500,000",
    "Over $2,500,000"
  ];

  // Add employee count ranges
  const employeeCountRanges = [
    "1-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1,000 employees",
    "1,001-5,000 employees",
    "5,001-10,000 employees",
    "10,000+ employees"
  ];

  // Add employee count filter state
  const [employeeCountFilter, setEmployeeCountFilter] = useState('');
  const [companyNameFilter, setCompanyNameFilter] = useState('');
  const [verifiedEmailFilter, setVerifiedEmailFilter] = useState(false);
  const [verifiedPhoneFilter, setVerifiedPhoneFilter] = useState(false);

  // Sample company data
  const [companies, setCompanies] = useState([
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
      employeeCount: 36000,
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
      employeeCount: 3400,
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
      employeeCount: 1600,
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
      employeeCount: 48000,
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
      employeeCount: 160,
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
      employeeCount: 45000,
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
      employeeCount: 2600,
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
      employeeCount: 10100,
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
      employeeCount: 440,
      industry: "Information Technology & Services"
    },
    {
      id: 11,
      name: "Vidyasagar Gurupalli",
      jobTitle: "Senior Information Technology Manager",
      company: "MSRcosmos LLC",
      emails: true,
      phoneNumbers: true,
      location: "United States",
      enriched: true,
      verified: true,
      employeeCount: 480,
      industry: "Information Technology & Services"
    },
    {
      id: 12,
      name: "Jose Pastor",
      jobTitle: "Head of Information Technology",
      company: "MAPFRE",
      emails: true,
      phoneNumbers: true,
      location: "Miami, Florida",
      enriched: true,
      verified: true,
      employeeCount: 36000,
      industry: "Insurance"
    },
    {
      id: 13,
      name: "Don Lebert",
      jobTitle: "Head of IT & Security",
      company: "Pinecone",
      emails: true,
      phoneNumbers: true,
      location: "Winterport, Maine",
      enriched: true,
      verified: true,
      employeeCount: 150,
      industry: "Information Technology & Services"
    },
    {
      id: 14,
      name: "Chris Webster",
      jobTitle: "Head of IT - Americas",
      company: "Lendlease",
      emails: true,
      phoneNumbers: true,
      location: "Charlotte, North Carolina",
      enriched: true,
      verified: true,
      employeeCount: 11000,
      industry: "Real Estate - Construction"
    }
  ]);

  // Custom select component to fix white dropdown issue
  const CustomSelect = ({ 
    value, 
    onChange, 
    options, 
    placeholder = "Select..."
  }: { 
    value: string; 
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
    
    const selectedOption = options.find(option => option.value === value);
    
    // Get dropdown position based on button position
    const getDropdownPosition = () => {
      if (!buttonRef.current) return { top: 0, left: 0, width: 0 };
      
      const rect = buttonRef.current.getBoundingClientRect();
      return {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      };
    };
    
    const position = getDropdownPosition();
    
    return (
      <div className="relative" ref={selectRef}>
        <button
          ref={buttonRef}
          type="button"
          className="w-full py-2 px-3 rounded-lg border border-white/20 bg-[#28292b] backdrop-blur-sm text-white focus:ring-2 focus:ring-[#10ba82] focus:border-transparent transition-all flex justify-between items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={`${!selectedOption ? 'text-white/50' : 'text-white'} truncate pr-2`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <MdKeyboardArrowRight className={`transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-90' : ''}`} />
        </button>
        
        {isOpen && createPortal(
          <div 
            className="fixed z-[9999] rounded-md bg-[#28292b] border border-white/10 shadow-lg max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              width: `${position.width}px`
            }}
          >
            <div className="py-1">
              {options.map((option) => (
                <div
                  key={option.value}
                  className={`cursor-pointer select-none relative py-2 px-3 ${
                    option.value === value 
                      ? 'bg-gradient-to-r from-[#10ba82]/40 to-[#0c9a6c]/30 text-white' 
                      : 'text-white/70 hover:bg-gradient-to-r hover:from-[#10ba82]/5 hover:via-[#0c9a6c]/3 hover:to-[#0c9a6c]/5'
                  }`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>,
          document.body
        )}
      </div>
    );
  };

  const [activeFilters, setActiveFilters] = useState<{[key: string]: string | boolean}>({});
  const [stateFilter, setStateFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [revenueFilter, setRevenueFilter] = useState('');
  const [erpModulesFilter, setErpModulesFilter] = useState('');

  // Toggle filter sections
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const handleFilterChange = (category: string, value: string | boolean) => {
    // Update activeFilters state
    if (typeof value === 'string' && value === '') {
      // Clear this filter
      const newActiveFilters = { ...activeFilters };
      delete newActiveFilters[category];
      setActiveFilters(newActiveFilters);
    } else {
      // Set or update this filter
      setActiveFilters(prev => ({
        ...prev,
        [category]: value
      }));
    }
    
    // Update the corresponding state variable
    switch (category) {
      case 'companyName':
        setCompanyNameFilter(value as string);
        break;
      case 'employeeCount':
        setEmployeeCountFilter(value as string);
        break;
      case 'state':
        setStateFilter(value as string);
        break;
      case 'sector':
        setSectorFilter(value as string);
        break;
      case 'revenue':
        setRevenueFilter(value as string);
        break;
      case 'erpModules':
        setErpModulesFilter(value as string);
        break;
      case 'verifiedEmail':
        setVerifiedEmailFilter(value as boolean);
        break;
      case 'verifiedPhone':
        setVerifiedPhoneFilter(value as boolean);
        break;
    }
    
    // Calculate how many filters are applied (excluding empty string filters)
    const activeFilterCount = Object.entries({ 
      ...activeFilters, 
      [category]: value 
    }).filter(([_, val]) => {
      if (typeof val === 'string') return val !== '';
      return val === true;
    }).length;
    
    // Calculate filtered count based on number of active filters
    let newFilteredCount = companiesStats.total;
    
    // Base reduction - each filter reduces the count by a percentage
    if (activeFilterCount > 0) {
      // Start with a baseline of 60% of total for first filter
      // Each additional filter reduces by increasing percentages
      switch (activeFilterCount) {
        case 1:
          newFilteredCount = Math.round(newFilteredCount * 0.60); // 60% of total
          break;
        case 2:
          newFilteredCount = Math.round(newFilteredCount * 0.40); // 40% of total
          break;
        case 3:
          newFilteredCount = Math.round(newFilteredCount * 0.27); // 27% of total
          break;
        case 4:
          newFilteredCount = Math.round(newFilteredCount * 0.19); // 19% of total
          break;
        case 5:
          newFilteredCount = Math.round(newFilteredCount * 0.12); // 12% of total
          break;
        default:
          newFilteredCount = Math.round(newFilteredCount * 0.05); // 5% of total for 6+ filters
      }
    }
    
    // Additional filter-specific reductions
    if (category === 'companyName' && typeof value === 'string' && value !== '') {
      // If filtering by company name, reduce count based on name specificity
      // The longer the name filter, the fewer results
      newFilteredCount = Math.max(10, Math.round(newFilteredCount * (1 - (value.length * 0.05))));
    }
    
    // Ensure minimum reasonable result count
    newFilteredCount = Math.max(newFilteredCount, 5);
    
    // Update companies stats with new filtered count
    setCompaniesStats(prev => ({
      ...prev,
      filtered: newFilteredCount
    }));
    
    // Update pagination
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      totalPages: Math.ceil(newFilteredCount / prev.itemsPerPage)
    }));
  };

  // Add a useEffect to update high potential and enriched counts when filtered count changes
  useEffect(() => {
    // Update enriched count based on filtered count, but keep highPotential fixed at 1964
    setCompaniesStats(prev => ({
      ...prev,
      enriched: 0,
      highPotential: 1964,
    }));
  }, [companiesStats.filtered]);

  // Update the clearAllFilters function
  const clearAllFilters = () => {
    setCompanyNameFilter('');
    setEmployeeCountFilter('');
    setStateFilter('');
    setSectorFilter('');
    setRevenueFilter('');
    setErpModulesFilter('');
    setVerifiedEmailFilter(false);
    setVerifiedPhoneFilter(false);
    setActiveFilters({});
    
    // Reset filtered count to total, but keep highPotential fixed at 1964
    setCompaniesStats(prev => ({
      ...prev,
      filtered: prev.total,
      highPotential: 1964,
      enriched: 0
    }));
    
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      totalPages: Math.ceil(companiesStats.total / prev.itemsPerPage)
    }));
  };

  const handleScrape = () => {
    if (!filters.companyType) {
      toast.error('Please enter what companies you are looking for');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Build a description of what's being searched for
      let searchDescription = filters.companyType;
      
      // Add filter details to the search description
      if (filters.state) {
        searchDescription += ` in ${filters.state}`;
      }
      if (filters.sector) {
        searchDescription += ` (${filters.sector} sector)`;
      }
      if (filters.revenue) {
        searchDescription += ` with ${filters.revenue}`;
      }
      if (filters.erpModules) {
        searchDescription += ` using ${filters.erpModules}`;
      }
      if (filters.showVerifiedOnly) {
        searchDescription += " with verified contacts";
      }
      
      toast.success(`Company data for ${searchDescription} scraped successfully`);
      
      // Add new companies with required employeeCount and industry properties
      setCompanies(prev => [
        ...prev,
        {
          id: 15,
          name: "Company O",
          jobTitle: "Head of IT",
          company: "Enterprise Corp",
          emails: true,
          phoneNumbers: true,
          location: "Austin, TX",
          enriched: true,
          verified: true,
          employeeCount: 3500,
          industry: "Technology"
        },
        {
          id: 16,
          name: "Company P",
          jobTitle: "Head of IT",
          company: "Tech Solutions Inc",
          emails: true,
          phoneNumbers: true,
          location: "Chandler, AZ",
          enriched: true,
          verified: true,
          employeeCount: 1200,
          industry: "Software"
        }
      ]);
      setCompaniesStats(prev => ({
        ...prev,
        total: prev.total + 2,
        filtered: prev.filtered + 2
      }));
    }, 2000);
  };

  const handleEnrich = () => {
    if (selectedCompanies.length === 0) {
      toast.error('Please select at least one company to enrich');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`${selectedCompanies.length} companies enriched successfully`);
      
      // Update enriched companies
      setCompanies(prev => prev.map(company => {
        if (selectedCompanies.includes(company.id)) {
          return {
            ...company,
            enriched: true
          };
        }
        return company;
      }));
      
      setSelectedCompanies([]);
    }, 2000);
  };

  const handleContinue = () => {
    if (companies.filter(f => f.enriched).length === 0) {
      toast.error('Please enrich at least one company before continuing');
      return;
    }
    navigate('/company-enrichment');
  };

  const handleSelectCompany = (id: number) => {
    setSelectedCompanies(prev => {
      if (prev.includes(id)) {
        return prev.filter(companyId => companyId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Helper function to generate random gradient patterns
  const getRandomGradient = () => {
    const patterns = [
      {
        base: "bg-gradient-to-tr from-green-500/30 via-emerald-500/20 to-green-600/15",
        blobs: [
          "absolute -top-20 left-1/4 w-40 h-40 bg-gradient-to-br from-green-500/40",
          "absolute bottom-1/3 -right-10 w-32 h-32 bg-gradient-to-tl from-emerald-500/30",
          "absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-green-600/25"
        ]
      },
      {
        base: "bg-gradient-to-bl from-green-600/30 via-emerald-600/20 to-green-500/15",
        blobs: [
          "absolute top-1/3 -left-16 w-48 h-48 bg-gradient-to-tr from-green-500/40",
          "absolute -bottom-10 right-1/4 w-36 h-36 bg-gradient-to-bl from-emerald-500/35",
          "absolute top-1/4 right-1/3 w-28 h-28 bg-gradient-to-tr from-green-600/30"
        ]
      },
      {
        base: "bg-gradient-to-r from-green-500/30 via-emerald-500/20 to-green-600/25",
        blobs: [
          "absolute -top-10 right-1/3 w-44 h-44 bg-gradient-to-bl from-green-500/45",
          "absolute bottom-1/4 -left-12 w-40 h-40 bg-gradient-to-tr from-emerald-600/40",
          "absolute top-2/3 right-1/4 w-32 h-32 bg-gradient-to-bl from-green-500/35"
        ]
      }
    ];
    return patterns[Math.floor(Math.random() * patterns.length)];
  };

  // Function to get filtered companies
  const getFilteredCompanies = () => {
    // Return all companies by default
    return companies;
  };

  // Get filtered companies
  const filteredCompanies = getFilteredCompanies();

  // Stats card component for the dashboard
  const StatsCard = ({ 
    title, 
    value, 
    change, 
    icon, 
    colorClass,
    borderColor = 'border-white/10' 
  }: { 
    title: string; 
    value: string; 
    change?: string;
    icon: React.ReactNode;
    colorClass: string;
    borderColor?: string;
  }) => {
    return (
      <div className={`backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/40 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 border border-green-500/20 hover:-translate-y-1 relative overflow-hidden group`}>
        {/* Enhanced gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 via-emerald-500/20 to-teal-500/30 opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-green-500/40 to-transparent rounded-full blur-2xl transform rotate-12 opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-tr from-teal-500/30 to-transparent rounded-full blur-xl transform -rotate-12 opacity-80 group-hover:opacity-90"></div>
        <div className="absolute top-1/3 -right-8 w-20 h-20 bg-gradient-to-bl from-emerald-500/30 to-transparent rounded-full blur-lg transform rotate-45 opacity-70"></div>
        
        <div className="relative z-10 p-6 bg-gradient-to-br from-white/[0.07] to-white/[0.02] rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-white/90 mb-1">{title}</p>
              <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">{value}</h3>
              {change && (
                <div className="flex items-center text-xs font-medium text-green-300 mt-2">
                  <MdTrendingUp className="mr-1" /> {change}
                </div>
              )}
            </div>
            <div className={`rounded-2xl p-3 ${colorClass} shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform duration-300 backdrop-blur-md border border-white/20`}>
              {icon}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Filter chip component
  const FilterChip = ({ 
    label, 
    value, 
    isActive, 
    onClick 
  }: { 
    label: string; 
    value: string | boolean; 
    isActive: boolean; 
    onClick: () => void 
  }) => {
    return (
      <button 
        onClick={onClick} 
        className={`${isActive 
          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/20' 
          : 'bg-white/10 text-white/80 hover:bg-white/20'} 
          backdrop-blur-md rounded-full px-4 py-2 transition-all duration-300 text-sm font-medium border border-white/10 flex items-center gap-2`}
      >
        {label}
        {isActive && <MdCheck className="text-white" />}
      </button>
    );
  };

  // Add page navigation functions
  const goToNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setPagination(prev => ({
        ...prev,
        currentPage: prev.currentPage + 1
      }));
    }
  };

  const goToPrevPage = () => {
    if (pagination.currentPage > 1) {
      setPagination(prev => ({
        ...prev,
        currentPage: prev.currentPage - 1
      }));
    }
  };

  // Function to format large numbers with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Modify the handleSearch function to show the dashboard with all companies when clicked
  const handleSearch = () => {
    setIsLoading(true);
    
    // Simulate API call with 5 second delay
    setTimeout(() => {
      setIsLoading(false);
      setShowDashboard(true);
      
      // Store current filters to localStorage for persistence
      try {
        localStorage.setItem('companyFilters', JSON.stringify(filters));
      } catch (error) {
        console.error('Error saving filters to localStorage', error);
      }
      
      // Set fixed number of filtered results
      setCompaniesStats(prev => ({
        ...prev,
        filtered: companies.length
      }));
      
      // Update page stats
      setPagination(prev => ({
        ...prev,
        currentPage: 1,
        totalPages: Math.ceil(companies.length / prev.itemsPerPage)
      }));
      
      // Build a description of what's being searched for based on active filters
      let searchDescription = "Head of IT at companies with >100 employees with verified emails and phone numbers";
      
      if (filters.companyTypeFilter) {
        searchDescription += ` in ${filters.companyTypeFilter}`;
      }
      
      // Add filter details to the search description
      if (filters.state) {
        searchDescription += ` in ${filters.state}`;
      }
      if (filters.sector) {
        searchDescription += ` (${filters.sector} sector)`;
      }
      if (filters.revenue) {
        searchDescription += ` with ${filters.revenue}`;
      }
      if (filters.erpModules) {
        searchDescription += ` using ${filters.erpModules}`;
      }
      
      toast.success(`Searching for ${searchDescription}`);
      
      // Update active filters to include Head of IT, >100 employees, and verified contacts as fixed filters
      setActiveFilters(prev => ({
        ...prev,
        jobTitle: "Head of IT",
        employeeCount: ">100 employees",
        verifiedEmail: true,
        verifiedPhone: true
      }));
      
      // Also set the verified filters state
      setVerifiedEmailFilter(true);
      setVerifiedPhoneFilter(true);
    }, 5000); // 5 second delay
  };

  return (
    <div className="w-full px-32 py-12 bg-[#020305] min-h-screen relative">
      {/* Background gradient orbs */}
      <div className="fixed top-20 right-40 w-96 h-96 bg-gradient-to-br from-[#10ba82]/5 to-transparent rounded-full blur-3xl transform rotate-12 opacity-70 pointer-events-none"></div>
      <div className="fixed bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-[#10ba82]/5 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-60 pointer-events-none"></div>

      {/* Main content with single scrollbar */}
      <div className="flex flex-col">
        {/* Header with title and stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#10ba82] via-[#0c9a6c] to-[#0a8a5c] p-3 rounded-xl text-white shadow-lg shadow-[#10ba82]/20">
              <MdBusinessCenter className="text-xl" />
            </div>
            <h1 className="text-2xl font-bold text-white">Market Database</h1>
          </div>
          
          {showDashboard && (
            <div className="text-white/70 text-sm flex items-center gap-2">
              <MdInfoOutline className="text-[#10ba82]" />
              <span>Showing <span className="text-[#10ba82] font-medium">{formatNumber(companiesStats.filtered)}</span> of {formatNumber(companiesStats.total)} companies</span>
              
              <button 
                onClick={clearAllFilters}
                className="ml-4 px-3 py-1 text-xs text-[#10ba82] hover:text-[#0c9a6c] bg-[#10ba82]/10 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
        
        {/* Main content area */}
        <div className="flex gap-6">
          {/* Filter sidebar - now wider */}
          <div className="w-96 backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/40 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-[#10ba82]/20 overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Filters</h2>
                {Object.keys(activeFilters).length > 0 && (
                  <button 
                    onClick={clearAllFilters}
                    className="px-3 py-1 text-xs text-[#10ba82] hover:text-[#0c9a6c] bg-[#10ba82]/10 rounded-lg transition-colors border border-[#10ba82]/20"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              {/* Active filters display */}
              {Object.keys(activeFilters).length > 0 && (
                <div className="mb-4 p-3 bg-[rgba(40,41,43,0.6)] rounded-xl border border-[#10ba82]/10">
                  <h3 className="text-sm font-medium text-white/80 mb-2">Active Filters:</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(activeFilters).map(([key, value]) => {
                      if (value === '' || value === false) return null;
                      
                      const formatFilterLabel = (key: string) => {
                        return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                      };
                      
                      const formatFilterValue = (key: string, value: string | boolean) => {
                        if (typeof value === 'boolean') {
                          return value ? 'Yes' : 'No';
                        }
                        return value;
                      };
                      
                      return (
                        <div 
                          key={key}
                          className="inline-flex items-center gap-2 py-1 px-3 rounded-full text-sm font-medium bg-gradient-to-r from-[#10ba82]/40 to-[#0c9a6c]/30 text-white border border-[#10ba82]/20 shadow-sm shadow-[#10ba82]/10 transition-all hover:shadow-md hover:scale-105"
                        >
                          <span>{formatFilterLabel(key)}: {formatFilterValue(key, value)}</span>
                          <button 
                            onClick={() => handleFilterChange(key, '')}
                            className="text-white/70 hover:text-white transition-colors rounded-full bg-white/10 hover:bg-white/20 h-5 w-5 flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Filter sections in a scrollable container with fancy scrollbar */}
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#10ba82]/40 scrollbar-track-white/5">
              {/* Collapsible Company Name Filter */}
                <div className="mb-3 bg-[rgba(40,41,43,0.4)] rounded-lg overflow-hidden border border-white/5 hover:border-[#10ba82]/20 transition-colors">
                <button
                  onClick={() => toggleSection('companyName')}
                    className="w-full p-3.5 flex justify-between items-center text-white hover:bg-[#10ba82]/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                      <div className="bg-[#10ba82]/20 p-2 rounded-lg">
                        <MdOutlineBusiness className="text-[#10ba82]" />
                      </div>
                    <span className="font-medium">Company Name</span>
                    {companyNameFilter && companyNameFilter !== '' && (
                        <span className="text-xs bg-[#10ba82]/20 text-[#10ba82] px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <MdKeyboardArrowRight className={`transition-transform duration-300 ${expandedSection === 'companyName' ? 'rotate-90' : ''}`} />
                </button>
                
                  <div className={`overflow-hidden transition-all duration-300 ${expandedSection === 'companyName' ? 'max-h-[200px]' : 'max-h-0'}`}>
                  <div className="p-3 bg-[rgba(40,41,43,0.2)]">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search company name..."
                        value={companyNameFilter}
                        onChange={(e) => handleFilterChange('companyName', e.target.value)}
                          className="w-full py-2 px-3 rounded-lg border border-white/20 bg-[#28292b] backdrop-blur-sm text-white focus:ring-2 focus:ring-[#10ba82] focus:border-transparent transition-all"
                      />
                      <MdSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                    </div>
                  </div>
                  </div>
              </div>
              
              {/* Collapsible Company Size Filter */}
                <div className="mb-3 bg-[rgba(40,41,43,0.4)] rounded-lg overflow-hidden border border-white/5 hover:border-[#10ba82]/20 transition-colors">
                <button
                  onClick={() => toggleSection('employeeCount')}
                    className="w-full p-3.5 flex justify-between items-center text-white hover:bg-[#10ba82]/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                      <div className="bg-[#10ba82]/20 p-2 rounded-lg">
                        <MdBusinessCenter className="text-[#10ba82]" />
                      </div>
                    <span className="font-medium">Company Size</span>
                    {employeeCountFilter && employeeCountFilter !== '' && (
                        <span className="text-xs bg-[#10ba82]/20 text-[#10ba82] px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <MdKeyboardArrowRight className={`transition-transform duration-300 ${expandedSection === 'employeeCount' ? 'rotate-90' : ''}`} />
                </button>
                
                  <div className={`overflow-hidden transition-all duration-300 ${expandedSection === 'employeeCount' ? 'max-h-[200px]' : 'max-h-0'}`}>
                  <div className="p-3 bg-[rgba(40,41,43,0.2)]">
                    <CustomSelect
                      value={employeeCountFilter}
                      onChange={(value) => handleFilterChange('employeeCount', value)}
                      options={employeeCountRanges.map(range => ({ value: range, label: range }))}
                      placeholder="Select company size..."
                    />
                  </div>
                  </div>
              </div>
              
              {/* Collapsible Location Filter */}
                <div className="mb-3 bg-[rgba(40,41,43,0.4)] rounded-lg overflow-hidden border border-white/5 hover:border-[#10ba82]/20 transition-colors">
                <button
                  onClick={() => toggleSection('location')}
                    className="w-full p-3.5 flex justify-between items-center text-white hover:bg-[#10ba82]/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                      <div className="bg-[#10ba82]/20 p-2 rounded-lg">
                        <MdLocationOn className="text-[#10ba82]" />
                      </div>
                    <span className="font-medium">Location</span>
                    {stateFilter && stateFilter !== '' && (
                        <span className="text-xs bg-[#10ba82]/20 text-[#10ba82] px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <MdKeyboardArrowRight className={`transition-transform duration-300 ${expandedSection === 'location' ? 'rotate-90' : ''}`} />
                </button>
                
                  <div className={`overflow-hidden transition-all duration-300 ${expandedSection === 'location' ? 'max-h-[200px]' : 'max-h-0'}`}>
                  <div className="p-3 bg-[rgba(40,41,43,0.2)]">
                    <CustomSelect
                      value={stateFilter}
                      onChange={(value) => handleFilterChange('state', value)}
                      options={usStates.map(state => ({ value: state, label: state }))}
                      placeholder="Select location..."
                    />
                  </div>
                  </div>
              </div>
              
              {/* Collapsible Industry/Sector Filter */}
                <div className="mb-3 bg-[rgba(40,41,43,0.4)] rounded-lg overflow-hidden border border-white/5 hover:border-[#10ba82]/20 transition-colors">
                <button
                  onClick={() => toggleSection('sector')}
                    className="w-full p-3.5 flex justify-between items-center text-white hover:bg-[#10ba82]/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                      <div className="bg-[#10ba82]/20 p-2 rounded-lg">
                        <MdFactory className="text-[#10ba82]" />
                      </div>
                    <span className="font-medium">Industry/Sector</span>
                    {sectorFilter && sectorFilter !== '' && (
                        <span className="text-xs bg-[#10ba82]/20 text-[#10ba82] px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <MdKeyboardArrowRight className={`transition-transform duration-300 ${expandedSection === 'sector' ? 'rotate-90' : ''}`} />
                </button>
                
                  <div className={`overflow-hidden transition-all duration-300 ${expandedSection === 'sector' ? 'max-h-[200px]' : 'max-h-0'}`}>
                  <div className="p-3 bg-[rgba(40,41,43,0.2)]">
                    <CustomSelect
                      value={sectorFilter}
                      onChange={(value) => handleFilterChange('sector', value)}
                      options={sectors.map(sector => ({ value: sector, label: sector }))}
                      placeholder="Select industry/sector..."
                    />
                  </div>
                  </div>
              </div>
              
              {/* Collapsible Revenue Filter */}
                <div className="mb-3 bg-[rgba(40,41,43,0.4)] rounded-lg overflow-hidden border border-white/5 hover:border-[#10ba82]/20 transition-colors">
                <button
                  onClick={() => toggleSection('revenue')}
                    className="w-full p-3.5 flex justify-between items-center text-white hover:bg-[#10ba82]/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                      <div className="bg-[#10ba82]/20 p-2 rounded-lg">
                        <MdAttachMoney className="text-[#10ba82]" />
                      </div>
                    <span className="font-medium">Revenue</span>
                    {revenueFilter && revenueFilter !== '' && (
                        <span className="text-xs bg-[#10ba82]/20 text-[#10ba82] px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <MdKeyboardArrowRight className={`transition-transform duration-300 ${expandedSection === 'revenue' ? 'rotate-90' : ''}`} />
                </button>
                
                  <div className={`overflow-hidden transition-all duration-300 ${expandedSection === 'revenue' ? 'max-h-[200px]' : 'max-h-0'}`}>
                  <div className="p-3 bg-[rgba(40,41,43,0.2)]">
                    <CustomSelect
                      value={revenueFilter}
                      onChange={(value) => handleFilterChange('revenue', value)}
                      options={revenueRanges.map(range => ({ value: range, label: range }))}
                      placeholder="Select revenue range..."
                    />
                  </div>
                  </div>
              </div>
              
              {/* Collapsible ERP Modules Filter */}
                <div className="mb-3 bg-[rgba(40,41,43,0.4)] rounded-lg overflow-hidden border border-white/5 hover:border-[#10ba82]/20 transition-colors">
                <button
                  onClick={() => toggleSection('erpModules')}
                    className="w-full p-3.5 flex justify-between items-center text-white hover:bg-[#10ba82]/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                      <div className="bg-[#10ba82]/20 p-2 rounded-lg">
                        <MdStorage className="text-[#10ba82]" />
                      </div>
                    <span className="font-medium">ERP Modules</span>
                    {erpModulesFilter && erpModulesFilter !== '' && (
                        <span className="text-xs bg-[#10ba82]/20 text-[#10ba82] px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <MdKeyboardArrowRight className={`transition-transform duration-300 ${expandedSection === 'erpModules' ? 'rotate-90' : ''}`} />
                </button>
                
                  <div className={`overflow-hidden transition-all duration-300 ${expandedSection === 'erpModules' ? 'max-h-[200px]' : 'max-h-0'}`}>
                  <div className="p-3 bg-[rgba(40,41,43,0.2)]">
                    <CustomSelect
                      value={erpModulesFilter}
                      onChange={(value) => handleFilterChange('erpModules', value)}
                      options={erpModulesRanges.map(range => ({ value: range, label: range }))}
                      placeholder="Select ERP modules..."
                    />
                  </div>
                  </div>
              </div>
              
              {/* Collapsible Verification Filter */}
                <div className="mb-3 bg-[rgba(40,41,43,0.4)] rounded-lg overflow-hidden border border-white/5 hover:border-[#10ba82]/20 transition-colors">
                <button
                  onClick={() => toggleSection('verification')}
                    className="w-full p-3.5 flex justify-between items-center text-white hover:bg-[#10ba82]/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                      <div className="bg-[#10ba82]/20 p-2 rounded-lg">
                        <MdCheck className="text-[#10ba82]" />
                      </div>
                    <span className="font-medium">Verification</span>
                    {(verifiedEmailFilter || verifiedPhoneFilter) && (
                        <span className="text-xs bg-[#10ba82]/20 text-[#10ba82] px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <MdKeyboardArrowRight className={`transition-transform duration-300 ${expandedSection === 'verification' ? 'rotate-90' : ''}`} />
                </button>
                
                  <div className={`overflow-hidden transition-all duration-300 ${expandedSection === 'verification' ? 'max-h-[200px]' : 'max-h-0'}`}>
                  <div className="p-3 bg-[rgba(40,41,43,0.2)]">
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2 text-white">
                        <input
                          type="checkbox"
                          checked={verifiedEmailFilter}
                          onChange={(e) => handleFilterChange('verifiedEmail', e.target.checked)}
                            className="rounded border-[#10ba82] text-[#10ba82] focus:ring-[#10ba82] h-4 w-4 bg-white/10"
                        />
                        <span>Verified Emails</span>
                      </label>
                      
                      <label className="flex items-center gap-2 text-white">
                        <input
                          type="checkbox"
                          checked={verifiedPhoneFilter}
                          onChange={(e) => handleFilterChange('verifiedPhone', e.target.checked)}
                            className="rounded border-[#10ba82] text-[#10ba82] focus:ring-[#10ba82] h-4 w-4 bg-white/10"
                        />
                        <span>Verified Phone Numbers</span>
                      </label>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
              
              {/* Submit button - now with improved styling */}
              <div className="mt-4">
                <button 
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#10ba82] to-[#0c9a6c] hover:from-[#0c9a6c] hover:to-[#0a8a5c] text-white py-3 px-4 rounded-lg font-medium transition-all text-sm shadow-md hover:shadow-xl flex items-center justify-center gap-2 group border border-white/20 relative overflow-hidden"
                >
                  {isLoading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                  <MdSearch className="text-lg" />
                  Apply Filters
                      <div className="absolute right-0 h-full w-12 bg-gradient-to-l from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-12 group-hover:translate-x-0"></div>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="flex-1">
            {isLoading ? (
              // Enhanced loading state
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-[calc(100vh-160px)]">
                <div className="max-w-2xl mx-auto">
                  <div className="mb-8 relative">
                    {/* Animated particles around spinner */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {[...Array(8)].map((_, i) => (
                        <div 
                          key={i} 
                          className="absolute h-2 w-2 rounded-full bg-[#10ba82]"
                          style={{
                            animation: `particle${i + 1} 5s infinite linear`,
                            opacity: 0.7,
                          }}
                        ></div>
                      ))}
                    </div>
                    
                    <div className="relative h-32 w-32 mx-auto">
                      {/* Spinner rings */}
                      <div className="absolute inset-0 rounded-full border-4 border-[#10ba82]/20 animate-ping"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-[#10ba82]/30 animate-pulse"></div>
                      
                      {/* Main spinner */}
                      <div className="h-full w-full animate-spin rounded-full border-4 border-[#10ba82] border-t-transparent flex items-center justify-center">
                        <div className="h-24 w-24 rounded-full border-4 border-[#10ba82]/40 border-b-transparent animate-spin"></div>
                      </div>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-3">Processing your request</h2>
                  <p className="text-white/70 mb-6">
                    Analyzing companies in our database...
                  </p>
                  
                  <div className="space-y-4">
                    {/* Loading steps with animations */}
                    <div className="flex items-center gap-3 opacity-0 animate-[fadeIn_0.5s_ease-in-out_0.2s_forwards]">
                      <div className="h-8 w-8 rounded-full bg-[#10ba82]/20 flex items-center justify-center">
                        <MdSearch className="text-[#10ba82]" />
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-[#10ba82]/20 rounded-full overflow-hidden relative">
                          <div className="absolute top-0 left-0 h-full bg-[#10ba82] animate-[searchingData_1.5s_ease-in-out_forwards]"></div>
                        </div>
                      </div>
                      <span className="text-sm text-white/60">Searching</span>
                    </div>
                    
                    <div className="flex items-center gap-3 opacity-0 animate-[fadeIn_0.5s_ease-in-out_1.5s_forwards]">
                      <div className="h-8 w-8 rounded-full bg-[#10ba82]/20 flex items-center justify-center">
                        <MdFilterList className="text-[#10ba82]" />
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-[#10ba82]/20 rounded-full overflow-hidden relative">
                          <div className="absolute top-0 left-0 h-full bg-[#10ba82] animate-[filteringData_1.5s_ease-in-out_forwards_1.5s]"></div>
                        </div>
                      </div>
                      <span className="text-sm text-white/60">Filtering</span>
                    </div>
                    
                    <div className="flex items-center gap-3 opacity-0 animate-[fadeIn_0.5s_ease-in-out_3s_forwards]">
                      <div className="h-8 w-8 rounded-full bg-[#10ba82]/20 flex items-center justify-center">
                        <MdDataUsage className="text-[#10ba82]" />
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-[#10ba82]/20 rounded-full overflow-hidden relative">
                          <div className="absolute top-0 left-0 h-full bg-[#10ba82] animate-[analyzingData_1.5s_ease-in-out_forwards_3s]"></div>
                        </div>
                      </div>
                      <span className="text-sm text-white/60">Analyzing</span>
                    </div>
                    
                    <div className="flex items-center gap-3 opacity-0 animate-[fadeIn_0.5s_ease-in-out_4.5s_forwards]">
                      <div className="h-8 w-8 rounded-full bg-[#10ba82]/20 flex items-center justify-center animate-pulse">
                        <MdCheck className="text-[#10ba82]" />
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-[#10ba82]/20 rounded-full overflow-hidden relative">
                          <div className="absolute top-0 left-0 h-full bg-[#10ba82] animate-[finalizing_0.5s_ease-in-out_forwards_4.5s]"></div>
                        </div>
                      </div>
                      <span className="text-sm text-white/60">Finalizing</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : !showDashboard ? (
              // Welcome message
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="max-w-2xl mx-auto">
                  <div className="mb-8 relative">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#10ba82]/20 via-[#10ba82]/10 to-transparent rounded-3xl flex items-center justify-center shadow-2xl shadow-[#10ba82]/20 border border-[#10ba82]/20">
                      <MdBusinessCenter className="text-6xl text-[#10ba82]" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-teal-500/20 via-teal-500/10 to-transparent rounded-2xl flex items-center justify-center shadow-xl shadow-teal-500/20 border border-teal-500/20">
                      <MdComputer className="text-3xl text-teal-400" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Tailored Market Database
                  </h2>
                  <p className="text-xl text-white/80 mb-4">
                    Based on the selections for your company profile, we have tailored everything towards your ideal customer profile.
                  </p>
                  <p className="text-lg text-white/70 mb-8">
                    We have identified <span className="text-[#10ba82] font-semibold">426,000</span> facilities which are eligible. Use the filters to narrow down your selection and obtain the specific demographic that matches your target audience.
                  </p>
                  
                  {/* Previous Lists Section */}
                  <div className="mb-10 bg-white/5 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4 text-left">Previous Lists</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 transition-all hover:shadow-lg cursor-pointer text-left">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-md bg-[#10ba82]/20">
                            <MdInsights className="text-[#10ba82]" />
                          </div>
                          <div>
                            <h4 className="font-medium text-white">Manufacturing Sector - Q2 2023</h4>
                            <p className="text-sm text-white/70 mt-1">143 contacts • Last updated 2 weeks ago</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 transition-all hover:shadow-lg cursor-pointer text-left">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-md bg-[#10ba82]/20">
                            <MdInsights className="text-[#10ba82]" />
                          </div>
                          <div>
                            <h4 className="font-medium text-white">Financial Services - High Value</h4>
                            <p className="text-sm text-white/70 mt-1">67 contacts • Last updated 1 month ago</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 transition-all hover:shadow-lg cursor-pointer text-left">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-md bg-[#10ba82]/20">
                            <MdOutlineStarOutline className="text-[#10ba82]" />
                          </div>
                          <div>
                            <h4 className="font-medium text-white">Favorite Leads - East Coast</h4>
                            <p className="text-sm text-white/70 mt-1">28 contacts • Saved as favorite</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 transition-all hover:shadow-lg cursor-pointer text-left">
                        <div className="flex items-center justify-center h-full text-white/30">
                          <MdAdd size={24} />
                          <span className="ml-2">Create New List</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 items-center">
                    {Object.keys(activeFilters).length > 0 && (
                      <div className="bg-white/10 p-3 rounded-lg mb-2 w-full max-w-md">
                        <p className="text-white/70 text-sm mb-2">Searching with these filters:</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(activeFilters).map(([key, value]) => (
                            <div key={key} className="bg-[#10ba82]/20 text-[#10ba82] px-2 py-0.5 rounded-full text-xs">
                              {key}: {value.toString()}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <button
                      onClick={handleSearch}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-[#10ba82] to-[#0c9a6c] hover:from-[#0c9a6c] hover:to-[#0a8a5c] text-white py-3 px-6 rounded-lg font-medium transition-all text-lg shadow-md hover:shadow-lg inline-flex items-center gap-2 group border border-white/20"
                    >
                      {isLoading ? (
                        <>
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                      <MdSearch className="text-xl" />
                      Search Companies
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Filter criteria summary */}
                <div className="mb-4 py-3 px-4 backdrop-blur-md bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/40 to-[rgba(40,41,43,0.2)] rounded-xl border border-[#10ba82]/15 text-white/80">
                  <p className="flex items-center gap-2">
                    <FaFilter className="text-[#10ba82] text-sm" />
                    <span className="text-sm">Criteria: <span className="font-medium text-white">Head of IT</span> at companies with <span className="font-medium text-white">&gt;100 employees</span> with <span className="font-medium text-white">verified emails</span>, <span className="font-medium text-white">verified phone numbers</span>, location: <span className="font-medium text-white">United States</span></span>
                    <span className="ml-auto text-[#10ba82] font-medium">14 Back end data points</span>
                  </p>
                </div>
              
                {/* Stats cards */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <StatsCard
                    title="Total Contacts"
                    value="2.3K"
                    change="+2.5% this month"
                    icon={<MdBusinessCenter className="text-white text-xl" />}
                    colorClass="bg-gradient-to-br from-[#10ba82] via-[#0c9a6c] to-[#0a8a5c]"
                  />
                  
                  <StatsCard
                    title="High Potential Companies"
                    value="1,964"
                    change="+3.1% this month"
                    icon={<MdDataUsage className="text-white text-xl" />}
                    colorClass="bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600"
                  />
                  
                  <StatsCard
                    title="Enriched Companies"
                    value="0"
                    change="+0.0% this month"
                    icon={<MdCheck className="text-white text-xl" />}
                    colorClass="bg-gradient-to-br from-emerald-500 via-emerald-600 to-[#10ba82]"
                  />
                </div>
                
                {/* Companies table */}
                <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-[#10ba82]/15 relative overflow-hidden">
                  {/* Table content */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#10ba82]/30 via-[#0c9a6c]/20 to-[#0a8a5c]/25 opacity-25"></div>
                  <div className="absolute -top-10 right-1/3 w-44 h-44 bg-gradient-to-bl from-[#10ba82]/45 to-transparent rounded-full blur-3xl transform rotate-90"></div>
                  <div className="absolute bottom-1/4 -left-12 w-40 h-40 bg-gradient-to-tr from-[#0c9a6c]/40 to-transparent rounded-full blur-2xl"></div>
                  
                  <div className="relative z-10 overflow-x-auto rounded-2xl">
                    <table className="w-full">
                      <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                          <th className="w-10 py-3 px-2">
                            <input 
                              type="checkbox" 
                              className="rounded border-[#10ba82] text-[#10ba82] focus:ring-[#10ba82] h-4 w-4 bg-white/10"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCompanies(companies.map(f => f.id));
                                } else {
                                  setSelectedCompanies([]);
                                }
                              }}
                              checked={selectedCompanies.length === companies.length && companies.length > 0}
                            />
                          </th>
                          <th className="py-3 px-2 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                          <th className="py-3 px-2 text-left text-xs font-medium text-white uppercase tracking-wider">Job Title</th>
                          <th className="py-3 px-2 text-left text-xs font-medium text-white uppercase tracking-wider">Company</th>
                          <th className="py-3 px-2 text-left text-xs font-medium text-white uppercase tracking-wider">Contact</th>
                          <th className="py-3 px-2 text-left text-xs font-medium text-white uppercase tracking-wider">Location</th>
                          <th className="py-3 px-2 text-left text-xs font-medium text-white uppercase tracking-wider">Industry</th>
                          <th className="py-3 px-2 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {companies.map((company) => (
                            <tr key={company.id} className={`${
                              selectedCompanies.includes(company.id) 
                              ? "bg-[#10ba82]/20" 
                                : "hover:bg-white/5"
                              } transition-colors`}
                            >
                              <td className="py-2 px-2">
                                <input 
                                  type="checkbox" 
                                className="rounded border-[#10ba82] text-[#10ba82] focus:ring-[#10ba82] h-4 w-4 bg-white/10"
                                  checked={selectedCompanies.includes(company.id)}
                                  onChange={() => handleSelectCompany(company.id)}
                                />
                              </td>
                            <td className="py-2 px-2 text-sm font-medium text-[#10ba82] hover:text-[#0c9a6c] cursor-pointer">{company.name}</td>
                            <td className="py-2 px-2 text-sm text-white/80">{company.jobTitle}</td>
                              <td className="py-2 px-2 text-sm text-white/80">{company.company}</td>
                              <td className="py-2 px-2 text-sm">
                                <div className="flex items-center gap-1">
                                {company.emails && <MdEmail className="text-[#10ba82] text-sm" />}
                                {company.phoneNumbers && <MdOutlinePhone className="text-[#10ba82] text-sm" />}
                                </div>
                              </td>
                              <td className="py-2 px-2 text-sm text-white/80">{company.location}</td>
                            <td className="py-2 px-2 text-sm text-white/80">{company.industry}</td>
                              <td className="py-2 px-2 text-sm">
                                <div className="flex gap-1">
                                  <button 
                                    onClick={() => {
                                      // Store the filtered companies in localStorage so SignalScanner can use them
                                      try {
                                      localStorage.setItem('filteredCompanies', JSON.stringify(companies));
                                      } catch (error) {
                                        console.error('Error saving filtered companies to localStorage', error);
                                      }
                                      navigate('/signal-scanner');
                                    }}
                                  className="p-1.5 rounded-lg bg-gradient-to-r from-[#10ba82] to-[#0c9a6c] text-white shadow-sm"
                                  >
                                    <MdArrowForward size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                    </div>
                    
                {/* Add pagination at the bottom */}
                <div className="flex justify-between items-center mt-6 mb-3">
                  <div className="text-white/70 text-sm">
                    Showing <span className="text-white">1-{companies.length}</span> of <span className="text-white">{formatNumber(companiesStats.total)}</span> contacts
                  </div>
                  <div className="flex gap-1">
                      <button 
                      className="bg-white/10 text-white/70 px-3 py-1 rounded-md hover:bg-white/20 transition-all disabled:opacity-50"
                      disabled={pagination.currentPage === 1}
                      >
                      Previous
                      </button>
                    <button className="bg-gradient-to-r from-[#10ba82] to-[#0c9a6c] text-white px-3 py-1 rounded-md hover:from-[#0c9a6c] hover:to-[#0a8a5c] transition-all">1</button>
                    <button className="bg-white/10 text-white px-3 py-1 rounded-md hover:bg-white/20 transition-all">2</button>
                    <button className="bg-white/10 text-white px-3 py-1 rounded-md hover:bg-white/20 transition-all">3</button>
                    <button className="bg-white/10 text-white px-3 py-1 rounded-md hover:bg-white/20 transition-all">...</button>
                    <button className="bg-white/10 text-white px-3 py-1 rounded-md hover:bg-white/20 transition-all">230</button>
                      <button 
                      className="bg-white/10 text-white/70 px-3 py-1 rounded-md hover:bg-white/20 transition-all"
                      >
                      Next
                      </button>
                  </div>
                </div>
                
                {/* Add Search for Signals button */}
                <div className="flex justify-end mt-6 mb-8">
                  <button
                    onClick={() => {
                      // Store the filtered companies in localStorage so SignalScanner can use them
                      try {
                        localStorage.setItem('filteredCompanies', JSON.stringify(companies));
                      } catch (error) {
                        console.error('Error saving filtered companies to localStorage', error);
                      }
                      navigate('/signal-scanner');
                    }}
                    className="bg-gradient-to-r from-[#10ba82] to-[#0c9a6c] hover:from-[#0c9a6c] hover:to-[#0a8a5c] text-white py-2 px-6 rounded-lg font-medium transition-all text-sm shadow-md hover:shadow-lg inline-flex items-center gap-2 group border border-white/20"
                  >
                    <MdInsights className="text-lg" />
                    Search for Signals
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      <style>
        {`
        @keyframes loading {
          0% { width: 0; }
          100% { width: 100%; }
        }
        @keyframes searchingData {
          0% { width: 0; }
          100% { width: 100%; }
        }
        @keyframes filteringData {
          0% { width: 0; }
          100% { width: 100%; }
        }
        @keyframes analyzingData {
          0% { width: 0; }
          100% { width: 100%; }
        }
        @keyframes finalizing {
          0% { width: 0; }
          100% { width: 100%; }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes particle1 {
          0% { transform: translate(0, 0); }
          25% { transform: translate(50px, 50px); }
          50% { transform: translate(100px, 0); }
          75% { transform: translate(50px, -50px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes particle2 {
          0% { transform: translate(0, 0); }
          25% { transform: translate(-50px, 50px); }
          50% { transform: translate(-100px, 0); }
          75% { transform: translate(-50px, -50px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes particle3 {
          0% { transform: translate(0, 0); }
          25% { transform: translate(50px, -50px); }
          50% { transform: translate(0, -100px); }
          75% { transform: translate(-50px, -50px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes particle4 {
          0% { transform: translate(0, 0); }
          25% { transform: translate(50px, 50px); }
          50% { transform: translate(0, 100px); }
          75% { transform: translate(-50px, 50px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes particle5 {
          0% { transform: translate(0, 0); }
          25% { transform: translate(70px, 20px); }
          50% { transform: translate(80px, 50px); }
          75% { transform: translate(40px, 70px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes particle6 {
          0% { transform: translate(0, 0); }
          25% { transform: translate(-70px, 20px); }
          50% { transform: translate(-80px, 50px); }
          75% { transform: translate(-40px, 70px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes particle7 {
          0% { transform: translate(0, 0); }
          25% { transform: translate(-70px, -20px); }
          50% { transform: translate(-50px, -80px); }
          75% { transform: translate(-10px, -60px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes particle8 {
          0% { transform: translate(0, 0); }
          25% { transform: translate(70px, -20px); }
          50% { transform: translate(50px, -80px); }
          75% { transform: translate(10px, -60px); }
          100% { transform: translate(0, 0); }
        }
        `}
      </style>
    </div>
  );
};

export default MarketDatabase;