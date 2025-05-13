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
  const [showDashboard, setShowDashboard] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [companiesStats, setCompaniesStats] = useState({
    total: 426000,
    filtered: 426000,
    small: 283000,
    medium: 106500,
    large: 36500,
    enriched: 190000,
    highPotential: 53800,
  });
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 42600,
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
      id: 1,
      name: "Ripudaman Bandyopadhyay",
      jobTitle: "Head of IT",
      company: "Zuan Infraworld India Ltd",
      emails: true,
      phoneNumbers: true,
      location: "Bengaluru, India",
      enriched: true,
      verified: true,
      employeeCount: 78,
      industry: "Real Estate"
    },
    {
      id: 2,
      name: "Karl Wisniewski",
      jobTitle: "Head of IT",
      company: "Sandvik",
      emails: true,
      phoneNumbers: true,
      location: "Roedermark, Germany",
      enriched: true,
      verified: true,
      employeeCount: 4000,
      industry: "Mining & Metals"
    },
    {
      id: 3,
      name: "Grant Hodge",
      jobTitle: "Head of IT",
      company: "Viridor",
      emails: true,
      phoneNumbers: true,
      location: "Taunton, United Kingdom",
      enriched: true,
      verified: true,
      employeeCount: 1200,
      industry: "Environmental Services"
    },
    {
      id: 4,
      name: "Franz Mittermayr",
      jobTitle: "Head of IT",
      company: "Elseco",
      emails: true,
      phoneNumbers: true,
      location: "Dubai, United Arab Emirates",
      enriched: true,
      verified: true,
      employeeCount: 82,
      industry: "Insurance"
    },
    {
      id: 5,
      name: "Raed Tekeh",
      jobTitle: "Head of IT",
      company: "National Bank of Kuwait",
      emails: true,
      phoneNumbers: true,
      location: "Dubai, United Arab Emirates",
      enriched: true,
      verified: true,
      employeeCount: 7400,
      industry: "Banking"
    },
    {
      id: 6,
      name: "Patrick Antic",
      jobTitle: "Head of IT",
      company: "Bertrams Chemical Plant",
      emails: true,
      phoneNumbers: true,
      location: "Basel, Switzerland",
      enriched: true,
      verified: true,
      employeeCount: 80,
      industry: "Machinery"
    },
    {
      id: 7,
      name: "Sven Faber",
      jobTitle: "Head of IT",
      company: "GROHE",
      emails: true,
      phoneNumbers: true,
      location: "Duesseldorf, Germany",
      enriched: true,
      verified: true,
      employeeCount: 9000,
      industry: "Consumer Goods"
    },
    {
      id: 8,
      name: "Tung Nguyen",
      jobTitle: "Head of IT",
      company: "FPT Software",
      emails: true,
      phoneNumbers: true,
      location: "Vietnam",
      enriched: true,
      verified: true,
      employeeCount: 48000,
      industry: "Information Technology & Services"
    },
    {
      id: 9,
      name: "Danny Cater",
      jobTitle: "Head of IT",
      company: "Square One Resources",
      emails: true,
      phoneNumbers: true,
      location: "London, United Kingdom",
      enriched: true,
      verified: true,
      employeeCount: 75,
      industry: "Staffing & Recruiting"
    },
    {
      id: 10,
      name: "Johan Finck",
      jobTitle: "Head of IT",
      company: "NIBE Group",
      emails: true,
      phoneNumbers: true,
      location: "Markaryd, Sweden",
      enriched: true,
      verified: true,
      employeeCount: 2700,
      industry: "Machinery"
    },
    {
      id: 11,
      name: "Gustavo Combre",
      jobTitle: "Head of IT",
      company: "Gowel",
      emails: true,
      phoneNumbers: true,
      location: "Sao Paulo, Brazil",
      enriched: true,
      verified: true,
      employeeCount: 82,
      industry: "Financial Services"
    },
    {
      id: 12,
      name: "Sven Steinlae",
      jobTitle: "Head of IT",
      company: "ALLYISCA Assistance GmbH",
      emails: true,
      phoneNumbers: true,
      location: "Munich, Germany",
      enriched: true,
      verified: true,
      employeeCount: 42,
      industry: "Insurance"
    },
    {
      id: 13,
      name: "Daniel Bell",
      jobTitle: "Head of IT",
      company: "Chadwick Lawrence LLP",
      emails: true,
      phoneNumbers: true,
      location: "Leeds, United Kingdom",
      enriched: true,
      verified: true,
      employeeCount: 220,
      industry: "Legal Services"
    },
    {
      id: 14,
      name: "Saurabh Bhansali",
      jobTitle: "Head of IT",
      company: "Venus Jewel",
      emails: true,
      phoneNumbers: true,
      location: "Mumbai, India",
      enriched: true,
      verified: true,
      employeeCount: 130,
      industry: "Luxury Goods & Jewelry"
    },
    {
      id: 15,
      name: "Reto Tschachtli",
      jobTitle: "Head of IT",
      company: "Bellevue Asset Management",
      emails: true,
      phoneNumbers: true,
      location: "Horgen, Switzerland",
      enriched: true,
      verified: true,
      employeeCount: 94,
      industry: "Investment Management"
    },
    {
      id: 16,
      name: "Christian Lohse",
      jobTitle: "Head of IT",
      company: "OpenIAS",
      emails: true,
      phoneNumbers: true,
      location: "Hamburg, Germany",
      enriched: true,
      verified: true,
      employeeCount: 71,
      industry: "Information Technology & Services"
    },
    {
      id: 17,
      name: "Artturi Karjalainen",
      jobTitle: "Head of IT",
      company: "Revonic Group Oyj",
      emails: true,
      phoneNumbers: true,
      location: "Helsinki, Finland",
      enriched: true,
      verified: true,
      employeeCount: 30,
      industry: "Medical Devices"
    },
    {
      id: 18,
      name: "Martin Reinelt",
      jobTitle: "Head of IT",
      company: "gabocom",
      emails: true,
      phoneNumbers: true,
      location: "Passau, Germany",
      enriched: true,
      verified: true,
      employeeCount: 52,
      industry: "Plastics"
    },
    {
      id: 19,
      name: "Ben Tempest",
      jobTitle: "Head of IT",
      company: "Saba Group",
      emails: true,
      phoneNumbers: true,
      location: "United Kingdom",
      enriched: true,
      verified: true,
      employeeCount: 700,
      industry: "Facilities Services"
    },
    {
      id: 20,
      name: "Petros Andreou",
      jobTitle: "Head of IT",
      company: "Bernhard Schulte Shipmanagement",
      emails: true,
      phoneNumbers: true,
      location: "Cyprus",
      enriched: true,
      verified: true,
      employeeCount: 420,
      industry: "Maritime"
    },
    {
      id: 21,
      name: "Michael",
      jobTitle: "Head of IT",
      company: "WEKO",
      emails: true,
      phoneNumbers: true,
      location: "Nordhausen, Germany",
      enriched: true,
      verified: true,
      employeeCount: 45,
      industry: "Information Technology & Services"
    },
    {
      id: 22,
      name: "Purhsit Bayas",
      jobTitle: "Head of IT",
      company: "Wurth IT India",
      emails: true,
      phoneNumbers: true,
      location: "Pune, India",
      enriched: true,
      verified: true,
      employeeCount: 240,
      industry: "Information Technology & Services"
    },
    {
      id: 23,
      name: "Mazwid Banibelallah",
      jobTitle: "Head of IT",
      company: "DiffTrust",
      emails: true,
      phoneNumbers: true,
      location: "Grigny, France",
      enriched: true,
      verified: true,
      employeeCount: 300,
      industry: "Information Technology & Services"
    },
    {
      id: 24,
      name: "Lucien",
      jobTitle: "Head of IT",
      company: "Maxlead",
      emails: true,
      phoneNumbers: true,
      location: "Almere, Netherlands",
      enriched: true,
      verified: true,
      employeeCount: 100,
      industry: "Marketing & Advertising"
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
          className="w-full py-2 px-3 rounded-lg border border-white/20 bg-[#28292b] backdrop-blur-sm text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all flex justify-between items-center"
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
                      ? 'bg-gradient-to-r from-green-500/40 to-emerald-500/30 text-white' 
                      : 'text-white/70 hover:bg-gradient-to-r hover:from-green-500/5 hover:via-emerald-500/3 hover:to-green-600/5'
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
    // Update high potential and enriched counts based on filtered count
    setCompaniesStats(prev => ({
      ...prev,
      highPotential: Math.round(prev.filtered * 0.21),
      enriched: Math.round(prev.filtered * 0.45)
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
    
    // Reset filtered count to total
    setCompaniesStats(prev => ({
      ...prev,
      filtered: prev.total,
      highPotential: Math.round(prev.total * 0.21),
      enriched: Math.round(prev.total * 0.45)
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

  const filteredCompanies = companies.filter(company => {
    // Basic search term matching based on active filters
    const matchesSearch = companyNameFilter 
      ? company.name.toLowerCase().includes(companyNameFilter.toLowerCase()) || 
        company.company.toLowerCase().includes(companyNameFilter.toLowerCase())
      : true;
    
    // Job title filter - always filter for "Head of IT"
    const matchesJobTitle = company.jobTitle === "Head of IT";
    
    // Employee count filter - companies with more than 100 employees
    const matchesEmployeeCount = company.employeeCount > 100;
    
    // Standard filters
    const matchesVerified = !filters.showVerifiedOnly || company.verified;
    
    // Mock location matcher
    const mockLocationMatcher = () => {
      if (!stateFilter || stateFilter === '') return true;
      return company.location.includes(stateFilter);
    };
    
    // Mock industry/sector matcher
    const mockSectorMatcher = () => {
      if (!sectorFilter || sectorFilter === '') return true;
      return company.industry.toLowerCase().includes(sectorFilter.toLowerCase());
    };
    
    // Mock employee count matcher
    const mockEmployeeCountMatcher = () => {
      if (employeeCountFilter === '') return true;
      switch(employeeCountFilter) {
        case "1-50 employees": return company.employeeCount >= 1 && company.employeeCount <= 50;
        case "51-200 employees": return company.employeeCount >= 51 && company.employeeCount <= 200;
        case "201-500 employees": return company.employeeCount >= 201 && company.employeeCount <= 500;
        case "501-1,000 employees": return company.employeeCount >= 501 && company.employeeCount <= 1000;
        case "1,001-5,000 employees": return company.employeeCount >= 1001 && company.employeeCount <= 5000;
        case "5,001-10,000 employees": return company.employeeCount >= 5001 && company.employeeCount <= 10000;
        case "10,000+ employees": return company.employeeCount > 10000;
        default: return true;
      }
    };
    
    // Company name matching
    const matchesCompanyName = companyNameFilter === '' || 
      company.company.toLowerCase().includes(companyNameFilter.toLowerCase());
    
    // Verified email/phone matching
    const matchesVerifiedEmail = !verifiedEmailFilter || company.emails;
    const matchesVerifiedPhone = !verifiedPhoneFilter || company.phoneNumbers;
    
    // Mock Revenue matcher
    const mockRevenueMatcher = () => {
      if (!revenueFilter || revenueFilter === '') return true;
      // Use employee count as a proxy for revenue
      if (revenueFilter.includes("Under $10M")) return company.employeeCount < 50;
      if (revenueFilter.includes("$10M - $50M")) return company.employeeCount >= 50 && company.employeeCount < 200;
      if (revenueFilter.includes("$50M - $100M")) return company.employeeCount >= 200 && company.employeeCount < 500;
      if (revenueFilter.includes("$100M - $500M")) return company.employeeCount >= 500 && company.employeeCount < 1000;
      if (revenueFilter.includes("$500M - $1B")) return company.employeeCount >= 1000 && company.employeeCount < 5000;
      if (revenueFilter.includes("Over $1B")) return company.employeeCount >= 5000;
      return true;
    };
    
    // Mock ERP modules matcher
    const mockErpModulesMatcher = () => {
      if (!erpModulesFilter || erpModulesFilter === '') return true;
      // Use employee count as a proxy for ERP modules complexity
      if (erpModulesFilter.includes("Basic")) return company.employeeCount < 100;
      if (erpModulesFilter.includes("Standard")) return company.employeeCount >= 100 && company.employeeCount < 500;
      if (erpModulesFilter.includes("Advanced")) return company.employeeCount >= 500 && company.employeeCount < 2000;
      if (erpModulesFilter.includes("Enterprise")) return company.employeeCount >= 2000;
      return true;
    };
    
    // Combine all filter criteria
    return matchesSearch && 
           matchesJobTitle &&
           matchesEmployeeCount &&
           matchesVerified && 
           mockLocationMatcher() && 
           mockSectorMatcher() &&
           mockEmployeeCountMatcher() &&
           matchesCompanyName &&
           matchesVerifiedEmail &&
           matchesVerifiedPhone &&
           mockRevenueMatcher() &&
           mockErpModulesMatcher();
  });

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

  // Modify the handleSearch function to set more specific filters
  const handleSearch = () => {
    setShowDashboard(true);
    // Simulate loading state
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      
      // Store current filters to localStorage for persistence
      try {
        localStorage.setItem('companyFilters', JSON.stringify(filters));
      } catch (error) {
        console.error('Error saving filters to localStorage', error);
      }
      
      // Set fixed number of filtered results
      setCompaniesStats(prev => ({
        ...prev,
        filtered: 2300
      }));
      
      // Update page stats
      setPagination(prev => ({
        ...prev,
        currentPage: 1,
        totalPages: Math.ceil(2300 / prev.itemsPerPage)
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
    }, 1000);
  };

  return (
    <div className="w-full px-32 py-12 bg-[#020305] min-h-screen relative">
      {/* Background gradient orbs */}
      <div className="fixed top-20 right-40 w-96 h-96 bg-gradient-to-br from-green-500/5 to-transparent rounded-full blur-3xl transform rotate-12 opacity-70 pointer-events-none"></div>
      <div className="fixed bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-green-500/5 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-60 pointer-events-none"></div>

      {/* Main content with single scrollbar */}
      <div className="flex flex-col">
        {/* Header with title and stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 p-3 rounded-xl text-white shadow-lg shadow-green-500/20">
              <MdBusinessCenter className="text-xl" />
            </div>
            <h1 className="text-2xl font-bold text-white">Market Database</h1>
          </div>
          
          {showDashboard && (
            <div className="text-white/70 text-sm flex items-center gap-2">
              <MdInfoOutline className="text-green-400" />
              <span>Showing <span className="text-green-400 font-medium">{formatNumber(companiesStats.filtered)}</span> of {formatNumber(companiesStats.total)} companies</span>
              
              <button 
                onClick={clearAllFilters}
                className="ml-4 px-3 py-1 text-xs text-green-400 hover:text-green-300 bg-green-500/10 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
        
        {/* Main content area */}
        <div className="flex gap-4">
          {/* Filter sidebar */}
          <div className="w-80 backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/40 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-green-500/20">
            <div className="p-3">
              <h2 className="text-lg font-bold text-white mb-3">Filters</h2>
              
              {/* Active filters display */}
              {Object.keys(activeFilters).length > 0 && (
                <div className="mb-3 p-2 bg-[rgba(40,41,43,0.6)] rounded-xl border border-green-500/10">
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
                          className="inline-flex items-center gap-2 py-1 px-3 rounded-full text-sm font-medium bg-gradient-to-r from-green-500/40 to-emerald-500/30 text-white border border-green-500/20 shadow-sm shadow-green-500/10"
                        >
                          <span>{formatFilterLabel(key)}: {formatFilterValue(key, value)}</span>
                          <button 
                            onClick={() => handleFilterChange(key, '')}
                            className="text-white/70 hover:text-white transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Filter sections */}
              
              {/* Collapsible Company Name Filter */}
              <div className="mb-2 bg-[rgba(40,41,43,0.4)] rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('companyName')}
                  className="w-full p-3 flex justify-between items-center text-white hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MdOutlineBusiness className="text-green-400" />
                    <span className="font-medium">Company Name</span>
                    {companyNameFilter && companyNameFilter !== '' && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <MdKeyboardArrowRight className={`transition-transform duration-300 ${expandedSection === 'companyName' ? 'rotate-90' : ''}`} />
                </button>
                
                {expandedSection === 'companyName' && (
                  <div className="p-3 bg-[rgba(40,41,43,0.2)]">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search company name..."
                        value={companyNameFilter}
                        onChange={(e) => handleFilterChange('companyName', e.target.value)}
                        className="w-full py-2 px-3 rounded-lg border border-white/20 bg-[#28292b] backdrop-blur-sm text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                      <MdSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Collapsible Company Size Filter */}
              <div className="mb-2 bg-[rgba(40,41,43,0.4)] rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('employeeCount')}
                  className="w-full p-3 flex justify-between items-center text-white hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MdBusinessCenter className="text-green-400" />
                    <span className="font-medium">Company Size</span>
                    {employeeCountFilter && employeeCountFilter !== '' && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <MdKeyboardArrowRight className={`transition-transform duration-300 ${expandedSection === 'employeeCount' ? 'rotate-90' : ''}`} />
                </button>
                
                {expandedSection === 'employeeCount' && (
                  <div className="p-3 bg-[rgba(40,41,43,0.2)]">
                    <CustomSelect
                      value={employeeCountFilter}
                      onChange={(value) => handleFilterChange('employeeCount', value)}
                      options={employeeCountRanges.map(range => ({ value: range, label: range }))}
                      placeholder="Select company size..."
                    />
                  </div>
                )}
              </div>
              
              {/* Collapsible Location Filter */}
              <div className="mb-2 bg-[rgba(40,41,43,0.4)] rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('location')}
                  className="w-full p-3 flex justify-between items-center text-white hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MdLocationOn className="text-green-400" />
                    <span className="font-medium">Location</span>
                    {stateFilter && stateFilter !== '' && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <MdKeyboardArrowRight className={`transition-transform duration-300 ${expandedSection === 'location' ? 'rotate-90' : ''}`} />
                </button>
                
                {expandedSection === 'location' && (
                  <div className="p-3 bg-[rgba(40,41,43,0.2)]">
                    <CustomSelect
                      value={stateFilter}
                      onChange={(value) => handleFilterChange('state', value)}
                      options={usStates.map(state => ({ value: state, label: state }))}
                      placeholder="Select location..."
                    />
                  </div>
                )}
              </div>
              
              {/* Collapsible Industry/Sector Filter */}
              <div className="mb-2 bg-[rgba(40,41,43,0.4)] rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('sector')}
                  className="w-full p-3 flex justify-between items-center text-white hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MdFactory className="text-green-400" />
                    <span className="font-medium">Industry/Sector</span>
                    {sectorFilter && sectorFilter !== '' && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <MdKeyboardArrowRight className={`transition-transform duration-300 ${expandedSection === 'sector' ? 'rotate-90' : ''}`} />
                </button>
                
                {expandedSection === 'sector' && (
                  <div className="p-3 bg-[rgba(40,41,43,0.2)]">
                    <CustomSelect
                      value={sectorFilter}
                      onChange={(value) => handleFilterChange('sector', value)}
                      options={sectors.map(sector => ({ value: sector, label: sector }))}
                      placeholder="Select industry/sector..."
                    />
                  </div>
                )}
              </div>
              
              {/* Collapsible Revenue Filter */}
              <div className="mb-2 bg-[rgba(40,41,43,0.4)] rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('revenue')}
                  className="w-full p-3 flex justify-between items-center text-white hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MdAttachMoney className="text-green-400" />
                    <span className="font-medium">Revenue</span>
                    {revenueFilter && revenueFilter !== '' && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <MdKeyboardArrowRight className={`transition-transform duration-300 ${expandedSection === 'revenue' ? 'rotate-90' : ''}`} />
                </button>
                
                {expandedSection === 'revenue' && (
                  <div className="p-3 bg-[rgba(40,41,43,0.2)]">
                    <CustomSelect
                      value={revenueFilter}
                      onChange={(value) => handleFilterChange('revenue', value)}
                      options={revenueRanges.map(range => ({ value: range, label: range }))}
                      placeholder="Select revenue range..."
                    />
                  </div>
                )}
              </div>
              
              {/* Collapsible ERP Modules Filter */}
              <div className="mb-2 bg-[rgba(40,41,43,0.4)] rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('erpModules')}
                  className="w-full p-3 flex justify-between items-center text-white hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MdStorage className="text-green-400" />
                    <span className="font-medium">ERP Modules</span>
                    {erpModulesFilter && erpModulesFilter !== '' && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <MdKeyboardArrowRight className={`transition-transform duration-300 ${expandedSection === 'erpModules' ? 'rotate-90' : ''}`} />
                </button>
                
                {expandedSection === 'erpModules' && (
                  <div className="p-3 bg-[rgba(40,41,43,0.2)]">
                    <CustomSelect
                      value={erpModulesFilter}
                      onChange={(value) => handleFilterChange('erpModules', value)}
                      options={erpModulesRanges.map(range => ({ value: range, label: range }))}
                      placeholder="Select ERP modules..."
                    />
                  </div>
                )}
              </div>
              
              {/* Collapsible Verification Filter */}
              <div className="mb-2 bg-[rgba(40,41,43,0.4)] rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('verification')}
                  className="w-full p-3 flex justify-between items-center text-white hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MdCheck className="text-green-400" />
                    <span className="font-medium">Verification</span>
                    {(verifiedEmailFilter || verifiedPhoneFilter) && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <MdKeyboardArrowRight className={`transition-transform duration-300 ${expandedSection === 'verification' ? 'rotate-90' : ''}`} />
                </button>
                
                {expandedSection === 'verification' && (
                  <div className="p-3 bg-[rgba(40,41,43,0.2)]">
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2 text-white">
                        <input
                          type="checkbox"
                          checked={verifiedEmailFilter}
                          onChange={(e) => handleFilterChange('verifiedEmail', e.target.checked)}
                          className="rounded border-green-400 text-green-500 focus:ring-green-500 h-4 w-4 bg-white/10"
                        />
                        <span>Verified Emails</span>
                      </label>
                      
                      <label className="flex items-center gap-2 text-white">
                        <input
                          type="checkbox"
                          checked={verifiedPhoneFilter}
                          onChange={(e) => handleFilterChange('verifiedPhone', e.target.checked)}
                          className="rounded border-green-400 text-green-500 focus:ring-green-500 h-4 w-4 bg-white/10"
                        />
                        <span>Verified Phone Numbers</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Submit button */}
              <div className="mt-4">
                <button 
                  onClick={handleSearch}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 px-4 rounded-lg font-medium transition-all text-sm shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2 group border border-white/20"
                >
                  <MdSearch className="text-lg" />
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="flex-1">
            {!showDashboard ? (
              // Welcome message
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="max-w-2xl mx-auto">
                  <div className="mb-8 relative">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-500/20 via-green-500/10 to-transparent rounded-3xl flex items-center justify-center shadow-2xl shadow-green-500/20 border border-green-500/20">
                      <MdBusinessCenter className="text-6xl text-green-400" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-teal-500/20 via-teal-500/10 to-transparent rounded-2xl flex items-center justify-center shadow-xl shadow-teal-500/20 border border-teal-500/20">
                      <MdComputer className="text-3xl text-teal-400" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Discover SAP ERP Opportunities
                  </h2>
                  <p className="text-xl text-white/80 mb-8">
                    Our database contains over 426,000 companies across the United States. 
                    Use our advanced filters to find the perfect SAP implementation opportunities.
                  </p>
                  <div className="flex flex-col gap-2 items-center">
                    {Object.keys(activeFilters).length > 0 && (
                      <div className="bg-white/10 p-3 rounded-lg mb-2 w-full max-w-md">
                        <p className="text-white/70 text-sm mb-2">Searching with these filters:</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(activeFilters).map(([key, value]) => (
                            <div key={key} className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs">
                              {key}: {value.toString()}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <button
                      onClick={handleSearch}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-lg font-medium transition-all text-lg shadow-md hover:shadow-lg inline-flex items-center gap-2 group border border-white/20"
                    >
                      <MdSearch className="text-xl" />
                      Search Companies
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Filter criteria summary */}
                <div className="mb-4 py-3 px-4 backdrop-blur-md bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/40 to-[rgba(40,41,43,0.2)] rounded-xl border border-green-500/15 text-white/80">
                  <p className="flex items-center gap-2">
                    <FaFilter className="text-green-400 text-sm" />
                    <span className="text-sm">Criteria: <span className="font-medium text-white">Head of IT</span> at companies with <span className="font-medium text-white">&gt;100 employees</span> with <span className="font-medium text-white">verified emails</span> and <span className="font-medium text-white">phone numbers</span></span>
                    <span className="ml-auto text-green-400 font-medium">2,300 matches</span>
                  </p>
                </div>
              
                {/* Stats cards */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <StatsCard
                    title="Total Companies"
                    value="2.3K"
                    change="+2.5% this month"
                    icon={<MdBusinessCenter className="text-white text-xl" />}
                    colorClass="bg-gradient-to-br from-green-500 via-green-600 to-emerald-600"
                  />
                  
                  <StatsCard
                    title="High Potential Companies"
                    value={formatNumber(companiesStats.highPotential)}
                    change="+3.1% this month"
                    icon={<MdDataUsage className="text-white text-xl" />}
                    colorClass="bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600"
                  />
                  
                  <StatsCard
                    title="Enriched Companies"
                    value={formatNumber(companiesStats.enriched)}
                    change="+5.2% this month"
                    icon={<MdCheck className="text-white text-xl" />}
                    colorClass="bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600"
                  />
                </div>
                
                {/* Companies table */}
                <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-green-500/15 relative overflow-hidden">
                  {/* Unique gradient pattern */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 via-emerald-500/20 to-green-600/25 opacity-25"></div>
                  <div className="absolute -top-10 right-1/3 w-44 h-44 bg-gradient-to-bl from-green-500/45 to-transparent rounded-full blur-3xl transform rotate-90"></div>
                  <div className="absolute bottom-1/4 -left-12 w-40 h-40 bg-gradient-to-tr from-emerald-600/40 to-transparent rounded-full blur-2xl"></div>
                  
                  <div className="relative z-10 overflow-x-auto rounded-2xl">
                    <table className="w-full">
                      <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                          <th className="w-10 py-3 px-2">
                            <input 
                              type="checkbox" 
                              className="rounded border-green-400 text-green-500 focus:ring-green-500 h-4 w-4 bg-white/10"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCompanies(filteredCompanies.map(f => f.id));
                                } else {
                                  setSelectedCompanies([]);
                                }
                              }}
                              checked={selectedCompanies.length === filteredCompanies.length && filteredCompanies.length > 0}
                            />
                          </th>
                          <th className="py-3 px-2 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                          <th className="py-3 px-2 text-left text-xs font-medium text-white uppercase tracking-wider">Company</th>
                          <th className="py-3 px-2 text-left text-xs font-medium text-white uppercase tracking-wider">Contact</th>
                          <th className="py-3 px-2 text-left text-xs font-medium text-white uppercase tracking-wider">Location</th>
                          <th className="py-3 px-2 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {filteredCompanies.filter(company => company.employeeCount > 100).length > 0 ? (
                          filteredCompanies.filter(company => company.employeeCount > 100).map((company) => (
                            <tr key={company.id} className={`${
                              selectedCompanies.includes(company.id) 
                                ? "bg-green-500/20" 
                                : "hover:bg-white/5"
                              } transition-colors`}
                            >
                              <td className="py-2 px-2">
                                <input 
                                  type="checkbox" 
                                  className="rounded border-green-400 text-green-500 focus:ring-green-500 h-4 w-4 bg-white/10"
                                  checked={selectedCompanies.includes(company.id)}
                                  onChange={() => handleSelectCompany(company.id)}
                                />
                              </td>
                              <td className="py-2 px-2 text-sm font-medium text-green-400 hover:text-green-300 cursor-pointer">{company.name}</td>
                              <td className="py-2 px-2 text-sm text-white/80">{company.company}</td>
                              <td className="py-2 px-2 text-sm">
                                <div className="flex items-center gap-1">
                                  {company.emails && <MdEmail className="text-green-400 text-sm" />}
                                  {company.phoneNumbers && <MdOutlinePhone className="text-green-400 text-sm" />}
                                </div>
                              </td>
                              <td className="py-2 px-2 text-sm text-white/80">{company.location}</td>
                              <td className="py-2 px-2 text-sm">
                                <div className="flex gap-1">
                                  <button 
                                    onClick={() => {
                                      // Store the filtered companies in localStorage so SignalScanner can use them
                                      try {
                                        localStorage.setItem('filteredCompanies', JSON.stringify(filteredCompanies.filter(f => f.employeeCount > 100)));
                                      } catch (error) {
                                        console.error('Error saving filtered companies to localStorage', error);
                                      }
                                      navigate('/signal-scanner');
                                    }}
                                    className="p-1.5 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm"
                                  >
                                    <MdArrowForward size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="py-5 px-4 text-center text-white/60">
                              <div className="flex flex-col items-center">
                                <MdSearch className="text-3xl text-white/30 mb-2" />
                                <p className="text-sm text-white/80">No companies found</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Footer */}
                  <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-green-500/15 p-3 flex justify-between items-center mt-4">
                    <div className="text-white/70 text-xs">
                      Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to {Math.min(pagination.currentPage * pagination.itemsPerPage, companiesStats.filtered)} of {formatNumber(companiesStats.filtered)}
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={goToPrevPage}
                        disabled={pagination.currentPage <= 1}
                        className={`p-1.5 rounded-lg ${pagination.currentPage <= 1 ? 'bg-white/5 text-white/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'} transition-colors`}
                      >
                        <MdArrowBack size={16} />
                      </button>
                      
                      <div className="px-2 py-1 rounded-lg bg-white/10 text-white/80 text-xs flex items-center">
                        {pagination.currentPage} / {formatNumber(pagination.totalPages)}
                      </div>
                      
                      <button 
                        onClick={goToNextPage}
                        disabled={pagination.currentPage >= pagination.totalPages}
                        className={`p-1.5 rounded-lg ${pagination.currentPage >= pagination.totalPages ? 'bg-white/5 text-white/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'} transition-colors`}
                      >
                        <MdArrowForward size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Find Market Signals button */}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => {
                      // Store the filtered companies in localStorage so SignalScanner can use them
                      try {
                        localStorage.setItem('filteredCompanies', JSON.stringify(filteredCompanies.filter(company => company.employeeCount > 100)));
                      } catch (error) {
                        console.error('Error saving filtered companies to localStorage', error);
                      }
                      navigate('/signal-scanner');
                    }}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 px-6 rounded-lg font-medium transition-all text-sm shadow-md hover:shadow-lg inline-flex items-center gap-2 group border border-white/20"
                  >
                    <MdInsights className="text-lg" />
                    Find Market Signals
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketDatabase;