import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
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
} from 'react-icons/md';
import { toast } from 'react-hot-toast';
import { FaLinkedin, FaFilter } from 'react-icons/fa';

const FacilityDatabase = () => {
  const navigate = useNavigate();
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFacilities, setSelectedFacilities] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [squareFootageFilter, setSquareFootageFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('Technology');
  const [energyUsageFilter, setEnergyUsageFilter] = useState('');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [monthlyCostFilter, setMonthlyCostFilter] = useState('');
  const [installationSizeFilter, setInstallationSizeFilter] = useState('');
  const [dealSizeFilter, setDealSizeFilter] = useState('');
  const [totalCount, setTotalCount] = useState(335);
  const [netNewCount, setNetNewCount] = useState(335);
  const [savedCount, setSavedCount] = useState(0);
  const [dataScraped, setDataScraped] = useState(true);
  const [facilityType, setFacilityType] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{[key: string]: string | boolean}>({
    sector: 'Technology'
  });
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  
  const [currentFilterCategory, setCurrentFilterCategory] = useState('');
  const [expandedFilter, setExpandedFilter] = useState<string | null>('location');

  // Add facility search/filter state
  const [facilitySearchTerm, setFacilitySearchTerm] = useState('');
  const [facilityTypeFilter, setFacilityTypeFilter] = useState('');

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
    "Manufacturing", "Technology", "Healthcare", "Retail", "Warehousing", "Energy", 
    "Financial Services", "Education", "Food Production", "Automotive", "Electronics", 
    "Pharmaceuticals", "Logistics", "Aerospace", "Telecommunications"
  ];

  // Square footage ranges
  const squareFootageRanges = [
    "Under 10,000 sq ft",
    "10,000 - 50,000 sq ft",
    "50,000 - 100,000 sq ft", 
    "100,000 - 250,000 sq ft",
    "250,000 - 500,000 sq ft",
    "Over 500,000 sq ft"
  ];

  // Energy usage ranges
  const energyUsageRanges = [
    "Low (< 500,000 kWh/year)",
    "Medium (500,000 - 2,000,000 kWh/year)",
    "High (2,000,000 - 5,000,000 kWh/year)",
    "Very High (> 5,000,000 kWh/year)"
  ];

  // Cost ranges for filters
  const monthlyCostRanges = [
    "Under $5,000",
    "$5,000 - $10,000",
    "$10,000 - $25,000",
    "$25,000 - $50,000",
    "$50,000 - $100,000",
    "Over $100,000"
  ];

  const installationSizeRanges = [
    "Small (< 100kW)",
    "Medium (100kW - 500kW)",
    "Large (500kW - 1MW)",
    "Enterprise (> 1MW)"
  ];

  const dealSizeRanges = [
    "Under $250,000",
    "$250,000 - $500,000",
    "$500,000 - $1,000,000",
    "$1,000,000 - $2,500,000",
    "Over $2,500,000"
  ];

  // Add facility types
  const facilityTypes = [
    "Manufacturing Plant", 
    "Distribution Center", 
    "Warehouse", 
    "Retail Store", 
    "Office Building", 
    "Data Center", 
    "Hospital/Medical", 
    "Educational Institution", 
    "Hotel/Hospitality", 
    "Agricultural"
  ];

  // Add employee count ranges
  const employeeCountRanges = [
    "1-20 employees",
    "21-50 employees",
    "51-100 employees",
    "101-500 employees",
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

  // Sample facility data from the image
  const [facilities, setFacilities] = useState([
    {
      id: 1,
      name: "Jeff Levy",
      jobTitle: "Facilities Manager",
      company: "Apple",
      emails: true,
      phoneNumbers: true,
      location: "Atlanta, GA",
      enriched: true,
      verified: true
    },
    {
      id: 2,
      name: "Amy Huke",
      jobTitle: "Facilities Manager",
      company: "Honeywell",
      emails: true,
      phoneNumbers: true,
      location: "Kansas City, MO",
      enriched: true,
      verified: true
    },
    {
      id: 3,
      name: "Ryan Kuddes",
      jobTitle: "Facilities Manager",
      company: "Apple",
      emails: true,
      phoneNumbers: true,
      location: "Denver, CO",
      enriched: true,
      verified: true
    },
    {
      id: 4,
      name: "Zuretti Carter",
      jobTitle: "Facilities Manager",
      company: "ChargePoint",
      emails: true,
      phoneNumbers: true,
      location: "San Francisco, CA",
      enriched: true,
      verified: true
    },
    {
      id: 5,
      name: "Scott Simpson",
      jobTitle: "Facilities Manager",
      company: "Plexus Corp.",
      emails: true,
      phoneNumbers: true,
      location: "Neenah, WI",
      enriched: true,
      verified: true
    },
    {
      id: 6,
      name: "Rob Greinke",
      jobTitle: "Facilities Manager",
      company: "Eaton",
      emails: true,
      phoneNumbers: true,
      location: "Waukesha, WI",
      enriched: true,
      verified: true
    },
    {
      id: 7,
      name: "Ryan Frey",
      jobTitle: "Facilities Manager",
      company: "Vertiv",
      emails: true,
      phoneNumbers: true,
      location: "Delaware, OH",
      enriched: true,
      verified: true
    },
    {
      id: 8,
      name: "Fred Hotchkiss",
      jobTitle: "Facilities Manager",
      company: "EMS Technologies, Inc.",
      emails: true,
      phoneNumbers: true,
      location: "Binghamton, NY",
      enriched: true,
      verified: true
    },
    {
      id: 9,
      name: "Anthony Sankale",
      jobTitle: "Facilities Manager",
      company: "Novanta Inc.",
      emails: true,
      phoneNumbers: true,
      location: "Boston, MA",
      enriched: true,
      verified: true
    },
    {
      id: 10,
      name: "Bob Harrison",
      jobTitle: "Facilities Manager",
      company: "Franklin Electric",
      emails: true,
      phoneNumbers: true,
      location: "Bluffton, IN",
      enriched: true,
      verified: true
    },
    {
      id: 11,
      name: "Matt Olson",
      jobTitle: "Facilities Manager",
      company: "Bentek Corporation",
      emails: true,
      phoneNumbers: true,
      location: "San Jose, CA",
      enriched: true,
      verified: true
    },
    {
      id: 12,
      name: "Bradley Romero",
      jobTitle: "Facilities Manager",
      company: "Honeywell",
      emails: true,
      phoneNumbers: true,
      location: "Denver, CO",
      enriched: true,
      verified: true
    },
    {
      id: 13,
      name: "Vicente Cornejo",
      jobTitle: "Facilities Manager",
      company: "ITW Food Equipment Group",
      emails: true,
      phoneNumbers: true,
      location: "Dayton, OH",
      enriched: true,
      verified: true
    },
    {
      id: 14,
      name: "Daniel Conroy",
      jobTitle: "Facilities Manager",
      company: "Apple",
      emails: true,
      phoneNumbers: true,
      location: "Jersey City, NJ",
      enriched: true,
      verified: true
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
          className="w-full py-2 px-3 rounded-lg border border-white/20 bg-[#28292b] backdrop-blur-sm text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all flex justify-between items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={`${!selectedOption ? 'text-white/50' : 'text-white'} truncate pr-2`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <MdKeyboardArrowRight className={`transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-90' : ''}`} />
        </button>
        
        {isOpen && createPortal(
          <div 
            className="fixed z-[9999] rounded-md bg-[#28292b] border border-white/20 shadow-lg max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800"
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
                      ? 'bg-gradient-to-r from-orange-500/30 to-orange-600/10 text-white' 
                      : 'text-white/70 hover:bg-white/10'
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

  // Modify this function to handle all filter changes
  const handleFilterChange = (category: string, value: string | boolean) => {
    if (typeof value === 'string' && value === '') {
      // Clear this filter
      const newActiveFilters = { ...activeFilters };
      delete newActiveFilters[category];
      setActiveFilters(newActiveFilters);
    } else {
      // Set or update this filter
      setActiveFilters({
        ...activeFilters,
        [category]: value
      });
    }
    
    // Update the corresponding state variable
    switch (category) {
      case 'facilitySearch':
        setFacilitySearchTerm(value as string);
        break;
      case 'facilityType':
        setFacilityTypeFilter(value as string);
        break;
      case 'state':
        setStateFilter(value as string);
        break;
      case 'sector':
        setSectorFilter(value as string);
        break;
      case 'squareFootage':
        setSquareFootageFilter(value as string);
        break;
      case 'energyUsage':
        setEnergyUsageFilter(value as string);
        break;
      case 'monthlyCost':
        setMonthlyCostFilter(value as string);
        break;
      case 'installationSize':
        setInstallationSizeFilter(value as string);
        break;
      case 'dealSize':
        setDealSizeFilter(value as string);
        break;
      case 'location':
        setLocationFilter(value as string);
        break;
      case 'industry':
        setIndustryFilter(value as string);
        break;
      case 'verified':
        setShowVerifiedOnly(value as boolean);
        break;
      case 'employeeCount':
        setEmployeeCountFilter(value as string);
        break;
      case 'companyName':
        setCompanyNameFilter(value as string);
        break;
      case 'verifiedEmail':
        setVerifiedEmailFilter(value as boolean);
        break;
      case 'verifiedPhone':
        setVerifiedPhoneFilter(value as boolean);
        break;
    }
    
    // Update filtered stats based on selections
    let newFilteredCount = facilitiesStats.total;
    
    // If facility search is active, reduce count significantly
    if (facilitySearchTerm) {
      newFilteredCount = Math.round(newFilteredCount * 0.0002); // Very specific search
    }
    
    // If facility type is selected
    if (facilityTypeFilter) {
      const facilityTypeProportions: {[key: string]: number} = {
        'Manufacturing Plant': 0.14,
        'Distribution Center': 0.08,
        'Warehouse': 0.15,
        'Retail Store': 0.24,
        'Office Building': 0.18,
        'Data Center': 0.02,
        'Hospital/Medical': 0.04,
        'Educational Institution': 0.09,
        'Hotel/Hospitality': 0.05,
        'Agricultural': 0.01
      };
      
      newFilteredCount = Math.round(newFilteredCount * (facilityTypeProportions[facilityTypeFilter] || 0.1));
    }
    
    // If employee count is selected
    if (employeeCountFilter) {
      const employeeCountProportions: {[key: string]: number} = {
        '1-20 employees': 0.25,
        '21-50 employees': 0.18,
        '51-100 employees': 0.15,
        '101-500 employees': 0.21,
        '501-1,000 employees': 0.09,
        '1,001-5,000 employees': 0.07,
        '5,001-10,000 employees': 0.03,
        '10,000+ employees': 0.02
      };
      
      newFilteredCount = Math.round(newFilteredCount * (employeeCountProportions[employeeCountFilter] || 0.1));
    }
    
    // If company name filter is active
    if (companyNameFilter) {
      newFilteredCount = Math.round(newFilteredCount * 0.001); // Very specific filter
    }
    
    // If verified email/phone filters are active
    if (verifiedEmailFilter) {
      newFilteredCount = Math.round(newFilteredCount * 0.72); // 72% have verified emails
    }
    
    if (verifiedPhoneFilter) {
      newFilteredCount = Math.round(newFilteredCount * 0.65); // 65% have verified phones
    }
    
    // If other filters are active...
    // ... existing filter logic ...
    
    // Update the stats
    setFacilitiesStats(prev => ({
      ...prev,
      filtered: newFilteredCount
    }));
    
    // Update pagination based on new filtered count
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      totalPages: Math.ceil(newFilteredCount / prev.itemsPerPage)
    }));
    
    // Update active filter count
    setTimeout(() => {
      const count = Object.keys(activeFilters).length;
      setActiveFilterCount(count);
    }, 0);
  };

  const clearAllFilters = () => {
    setFacilitySearchTerm('');
    setFacilityTypeFilter('');
    setLocationFilter('');
    setIndustryFilter('');
    setSizeFilter('');
    setSquareFootageFilter('');
    setStateFilter('');
    setSectorFilter('');
    setEnergyUsageFilter('');
    setShowVerifiedOnly(false);
    setMonthlyCostFilter('');
    setInstallationSizeFilter('');
    setDealSizeFilter('');
    setEmployeeCountFilter('');
    setCompanyNameFilter('');
    setVerifiedEmailFilter(false);
    setVerifiedPhoneFilter(false);
    setActiveFilters({});
    setActiveFilterCount(0);
    
    // Reset filtered count to total
    setFacilitiesStats(prev => ({
      ...prev,
      filtered: prev.total
    }));
    
    // Reset pagination
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      totalPages: Math.ceil(facilitiesStats.total / prev.itemsPerPage)
    }));
  };

  const handleScrape = () => {
    if (!facilityType) {
      toast.error('Please enter what facilities you are looking for');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setDataScraped(true);
      
      // Build a description of what's being searched for
      let searchDescription = facilityType;
      
      // Add filter details to the search description
      if (stateFilter) {
        searchDescription += ` in ${stateFilter}`;
      }
      if (sectorFilter) {
        searchDescription += ` (${sectorFilter} sector)`;
      }
      if (squareFootageFilter) {
        searchDescription += ` with ${squareFootageFilter}`;
      }
      if (energyUsageFilter) {
        searchDescription += ` using ${energyUsageFilter}`;
      }
      if (showVerifiedOnly) {
        searchDescription += " with verified contacts";
      }
      
      toast.success(`Facility data for ${searchDescription} scraped successfully`);
      
      // Add new facilities
      setFacilities(prev => [
        ...prev,
        {
          id: 15,
          name: "Michael Johnson",
          jobTitle: "Facilities Manager",
          company: "Samsung Electronics",
          emails: true,
          phoneNumbers: true,
          location: "Austin, TX",
          enriched: true,
          verified: true
        },
        {
          id: 16,
          name: "Sarah Williams",
          jobTitle: "Facilities Manager",
          company: "Intel Corporation",
          emails: true,
          phoneNumbers: true,
          location: "Chandler, AZ",
          enriched: true,
          verified: true
        }
      ]);
      setTotalCount(337);
      setNetNewCount(337);
    }, 2000);
  };

  const handleEnrich = () => {
    if (selectedFacilities.length === 0) {
      toast.error('Please select at least one facility to enrich');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`${selectedFacilities.length} facilities enriched successfully`);
      
      // Update enriched facilities
      setFacilities(prev => prev.map(facility => {
        if (selectedFacilities.includes(facility.id)) {
          return {
            ...facility,
            enriched: true
          };
        }
        return facility;
      }));
      
      setSelectedFacilities([]);
    }, 2000);
  };

  const handleContinue = () => {
    if (facilities.filter(f => f.enriched).length === 0) {
      toast.error('Please enrich at least one facility before continuing');
      return;
    }
    navigate('/facility-enrichment');
  };

  const handleSelectFacility = (id: number) => {
    setSelectedFacilities(prev => {
      if (prev.includes(id)) {
        return prev.filter(facilityId => facilityId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Helper function to generate random gradient patterns
  const getRandomGradient = () => {
    const patterns = [
      {
        base: "bg-gradient-to-tr from-orange-500/30 via-amber-500/20 to-orange-600/15",
        blobs: [
          "absolute -top-20 left-1/4 w-40 h-40 bg-gradient-to-br from-orange-500/40",
          "absolute bottom-1/3 -right-10 w-32 h-32 bg-gradient-to-tl from-amber-500/30",
          "absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-orange-600/25"
        ]
      },
      {
        base: "bg-gradient-to-bl from-orange-600/30 via-amber-600/20 to-orange-500/15",
        blobs: [
          "absolute top-1/3 -left-16 w-48 h-48 bg-gradient-to-tr from-orange-500/40",
          "absolute -bottom-10 right-1/4 w-36 h-36 bg-gradient-to-bl from-amber-500/35",
          "absolute top-1/4 right-1/3 w-28 h-28 bg-gradient-to-tr from-orange-600/30"
        ]
      },
      {
        base: "bg-gradient-to-r from-orange-500/30 via-amber-500/20 to-orange-600/25",
        blobs: [
          "absolute -top-10 right-1/3 w-44 h-44 bg-gradient-to-bl from-orange-500/45",
          "absolute bottom-1/4 -left-12 w-40 h-40 bg-gradient-to-tr from-amber-600/40",
          "absolute top-2/3 right-1/4 w-32 h-32 bg-gradient-to-bl from-orange-500/35"
        ]
      }
    ];
    return patterns[Math.floor(Math.random() * patterns.length)];
  };

  const filteredFacilities = facilities.filter(facility => {
    // Only show facilities when data has been scraped
    if (!dataScraped) {
      return false;
    }
    
    // Basic search term matching based on active filters
    const matchesSearch = facilitySearchTerm 
      ? facility.name.toLowerCase().includes(facilitySearchTerm.toLowerCase()) || 
        facility.company.toLowerCase().includes(facilitySearchTerm.toLowerCase())
      : true;
    
    // Facility type matching (mocked for demonstration)
    const matchesFacilityType = facilityTypeFilter === '' || 
      (facility.id % facilityTypes.length === facilityTypes.indexOf(facilityTypeFilter) % facilityTypes.length);
    
    // Standard filters
    const matchesVerified = !showVerifiedOnly || facility.verified;
    const matchesLocation = locationFilter === '' || facility.location.includes(locationFilter);
    const matchesIndustry = industryFilter === '' || facility.company.includes(industryFilter);
    
    // Employee count matching (mocked for demonstration)
    const mockEmployeeCountMatcher = () => {
      if (employeeCountFilter === '') return true;
      // Mock logic based on facility ID for demonstration
      const mockEmployeeCount = (facility.id * 10) % 12000;
      switch(employeeCountFilter) {
        case "1-20 employees": return mockEmployeeCount >= 1 && mockEmployeeCount <= 20;
        case "21-50 employees": return mockEmployeeCount >= 21 && mockEmployeeCount <= 50;
        case "51-100 employees": return mockEmployeeCount >= 51 && mockEmployeeCount <= 100;
        case "101-500 employees": return mockEmployeeCount >= 101 && mockEmployeeCount <= 500;
        case "501-1,000 employees": return mockEmployeeCount >= 501 && mockEmployeeCount <= 1000;
        case "1,001-5,000 employees": return mockEmployeeCount >= 1001 && mockEmployeeCount <= 5000;
        case "5,001-10,000 employees": return mockEmployeeCount >= 5001 && mockEmployeeCount <= 10000;
        case "10,000+ employees": return mockEmployeeCount > 10000;
        default: return true;
      }
    };
    
    // Company name matching
    const matchesCompanyName = companyNameFilter === '' || 
      facility.company.toLowerCase().includes(companyNameFilter.toLowerCase());
    
    // Verified email/phone matching
    const matchesVerifiedEmail = !verifiedEmailFilter || facility.emails;
    const matchesVerifiedPhone = !verifiedPhoneFilter || facility.phoneNumbers;
    
    // Combine all filter criteria
    return matchesSearch && 
           matchesFacilityType &&
           matchesVerified && 
           matchesLocation && 
           matchesIndustry &&
           mockEmployeeCountMatcher() &&
           matchesCompanyName &&
           matchesVerifiedEmail &&
           matchesVerifiedPhone &&
           true;
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
      <div className={`backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/40 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 border border-orange-500/20 hover:-translate-y-1 relative overflow-hidden group`}>
        {/* Enhanced gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 via-purple-500/20 to-blue-500/30 opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-orange-500/40 to-transparent rounded-full blur-2xl transform rotate-12 opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-tr from-blue-500/30 to-transparent rounded-full blur-xl transform -rotate-12 opacity-80 group-hover:opacity-90"></div>
        <div className="absolute top-1/3 -right-8 w-20 h-20 bg-gradient-to-bl from-purple-500/30 to-transparent rounded-full blur-lg transform rotate-45 opacity-70"></div>
        
        <div className="relative z-10 p-6 bg-gradient-to-br from-white/[0.07] to-white/[0.02] rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-white/90 mb-1">{title}</p>
              <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">{value}</h3>
              {change && (
                <div className="flex items-center text-xs font-medium text-orange-300 mt-2">
                  <MdTrendingUp className="mr-1" /> {change}
                </div>
              )}
            </div>
            <div className={`rounded-2xl p-3 ${colorClass} shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-300 backdrop-blur-md border border-white/20`}>
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
          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20' 
          : 'bg-white/10 text-white/80 hover:bg-white/20'} 
          backdrop-blur-md rounded-full px-4 py-2 transition-all duration-300 text-sm font-medium border border-white/10 flex items-center gap-2`}
      >
        {label}
        {isActive && <MdCheck className="text-white" />}
      </button>
    );
  };

  // Update the state to include total database size info
  const [facilitiesStats, setFacilitiesStats] = useState({
    total: 4130000, // 4.13 million eligible commercial buildings
    filtered: 4130000,
    small: 2750000, // ~66.5% of eligible buildings are small
    medium: 1030000, // ~25% are medium
    large: 350000, // ~8.5% are large
    enriched: 1840000, // ~44.5% have been enriched with solar data
    highPotential: 520000, // ~12.6% have high solar potential
  });
  
  // Add pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 413000, // At 10 items per page
    itemsPerPage: 10
  });

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

  // Track which filter section is expanded
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Toggle expanded section
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Modify the handleSearch function to ensure filters are preserved after search
  const handleSearch = () => {
    setShowDashboard(true);
    // Simulate loading state
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      
      // Store current filters to localStorage for persistence
      try {
        localStorage.setItem('facilityFilters', JSON.stringify(activeFilters));
      } catch (error) {
        console.error('Error saving filters to localStorage', error);
      }
      
      // Build a description of what's being searched for based on active filters
      let searchDescription = "Facilities";
      
      if (facilityTypeFilter) {
        searchDescription = facilityTypeFilter;
      }
      
      // Add filter details to the search description
      if (stateFilter) {
        searchDescription += ` in ${stateFilter}`;
      }
      if (sectorFilter) {
        searchDescription += ` (${sectorFilter} sector)`;
      }
      if (squareFootageFilter) {
        searchDescription += ` with ${squareFootageFilter}`;
      }
      if (energyUsageFilter) {
        searchDescription += ` using ${energyUsageFilter}`;
      }
      if (showVerifiedOnly) {
        searchDescription += " with verified contacts";
      }
      
      toast.success(`Searching for ${searchDescription}`);
    }, 1000);
  };

  // Load saved filters on component mount
  useEffect(() => {
    try {
      const savedFilters = localStorage.getItem('facilityFilters');
      if (savedFilters) {
        const parsedFilters = JSON.parse(savedFilters) as {[key: string]: string | boolean};
        setActiveFilters(parsedFilters);
        
        // Apply saved filters to individual filter states
        Object.entries(parsedFilters).forEach(([key, value]) => {
          switch (key) {
            case 'facilitySearch':
              setFacilitySearchTerm(value as string);
              break;
            case 'facilityType':
              setFacilityTypeFilter(value as string);
              break;
            case 'state':
              setStateFilter(value as string);
              break;
            case 'sector':
              setSectorFilter(value as string);
              break;
            case 'squareFootage':
              setSquareFootageFilter(value as string);
              break;
            case 'energyUsage':
              setEnergyUsageFilter(value as string);
              break;
            case 'monthlyCost':
              setMonthlyCostFilter(value as string);
              break;
            case 'installationSize':
              setInstallationSizeFilter(value as string);
              break;
            case 'dealSize':
              setDealSizeFilter(value as string);
              break;
            case 'location':
              setLocationFilter(value as string);
              break;
            case 'industry':
              setIndustryFilter(value as string);
              break;
            case 'verified':
              setShowVerifiedOnly(value as boolean);
              break;
            case 'employeeCount':
              setEmployeeCountFilter(value as string);
              break;
            case 'companyName':
              setCompanyNameFilter(value as string);
              break;
            case 'verifiedEmail':
              setVerifiedEmailFilter(value as boolean);
              break;
            case 'verifiedPhone':
              setVerifiedPhoneFilter(value as boolean);
              break;
          }
        });
      }
    } catch (error) {
      console.error('Error loading saved filters', error);
    }
  }, []);

  return (
    <div className="w-full px-4 py-4 bg-[#020305] min-h-screen relative">
      {/* Background gradient orbs */}
      <div className="fixed top-20 right-40 w-96 h-96 bg-gradient-to-br from-orange-500/5 to-transparent rounded-full blur-3xl transform rotate-12 opacity-70 pointer-events-none"></div>
      <div className="fixed bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-orange-500/5 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-60 pointer-events-none"></div>

      {/* Main content with single scrollbar */}
      <div className="flex flex-col">
        {/* Header with title and stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 p-3 rounded-xl text-white shadow-lg shadow-orange-500/20">
              <MdFactory className="text-xl" />
            </div>
            <h1 className="text-2xl font-bold text-white">Facility Database</h1>
          </div>
          
          {showDashboard && (
            <div className="text-white/70 text-sm flex items-center gap-2">
              <MdInfoOutline className="text-orange-400" />
              <span>Showing <span className="text-orange-400 font-medium">{formatNumber(facilitiesStats.filtered)}</span> of {formatNumber(facilitiesStats.total)} facilities</span>
              
              <button 
                onClick={clearAllFilters}
                className="ml-4 px-3 py-1 text-xs text-orange-400 hover:text-orange-300 bg-orange-500/10 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
        
        {/* Main content area */}
        <div className="flex gap-4">
          {/* Collapsible filter sidebar - no separate scrollbar */}
          <div className="w-80 backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/40 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-orange-500/20">
            <div className="p-3">
              <h2 className="text-lg font-bold text-white mb-3">Filters</h2>
              
              {/* Active filters display - always visible */}
              {Object.entries(activeFilters).some(([_, value]) => value !== '' && value !== false) && (
                <div className="mb-3 p-2 bg-[rgba(40,41,43,0.6)] rounded-xl border border-orange-500/10">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(activeFilters).map(([key, value]) => (
                      <FilterChip 
                        key={key}
                        label={key} 
                        value={value} 
                        isActive={true} 
                        onClick={() => handleFilterChange(key, '')} 
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Collapsible Company Name Filter */}
              <div className="mb-2 bg-[rgba(40,41,43,0.4)] rounded-lg overflow-hidden">
                <button 
                  onClick={() => toggleSection('companyName')}
                  className="w-full p-3 flex justify-between items-center text-white hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MdOutlineBusiness className="text-orange-400" />
                    <span className="font-medium">Company Name</span>
                    {companyNameFilter && (
                      <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <MdKeyboardArrowRight className={`transition-transform duration-300 ${expandedSection === 'companyName' ? 'rotate-90' : ''}`} />
                </button>
                
                {expandedSection === 'companyName' && (
                  <div className="p-3 bg-white/5 border-t border-white/10">
                    <div className="relative">
                      <input
                        type="text"
                        value={companyNameFilter}
                        onChange={(e) => handleFilterChange('companyName', e.target.value)}
                        placeholder="Filter by company name..."
                        className="w-full py-2 px-3 pl-9 rounded-lg border border-white/20 bg-[#28292b] backdrop-blur-sm text-white placeholder:text-white/50 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      />
                      <MdSearch className="absolute left-3 top-3 text-white/50" />
                      {companyNameFilter && (
                        <button
                          onClick={() => handleFilterChange('companyName', '')}
                          className="absolute right-3 top-3 text-white/50 hover:text-white"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Collapsible Company Size Filter */}
              <div className="mb-2 bg-[rgba(40,41,43,0.4)] rounded-lg overflow-hidden">
                <button 
                  onClick={() => toggleSection('companySize')}
                  className="w-full p-3 flex justify-between items-center text-white hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MdPieChart className="text-orange-400" />
                    <span className="font-medium">Company Size</span>
                    {employeeCountFilter && (
                      <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <MdKeyboardArrowRight className={`transition-transform duration-300 ${expandedSection === 'companySize' ? 'rotate-90' : ''}`} />
                </button>
                
                {expandedSection === 'companySize' && (
                  <div className="p-3 bg-white/5 border-t border-white/10 overflow-visible">
                    <CustomSelect
                      value={employeeCountFilter}
                      onChange={(value) => handleFilterChange('employeeCount', value)}
                      options={[
                        { value: "", label: "All Company Sizes" },
                        ...employeeCountRanges.map(range => ({ value: range, label: range }))
                      ]}
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
                    <MdLocationOn className="text-orange-400" />
                    <span className="font-medium">Location</span>
                    {stateFilter && (
                      <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <MdKeyboardArrowRight className={`transition-transform duration-300 ${expandedSection === 'location' ? 'rotate-90' : ''}`} />
                </button>
                
                {expandedSection === 'location' && (
                  <div className="p-3 bg-white/5 border-t border-white/10 overflow-visible">
                    <CustomSelect
                      value={stateFilter}
                      onChange={(value) => handleFilterChange('state', value)}
                      options={[
                        { value: "", label: "All Locations" },
                        ...usStates.map(state => ({ value: state, label: state }))
                      ]}
                      placeholder="Select state..."
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
                    <MdBarChart className="text-orange-400" />
                    <span className="font-medium">Industry Sector</span>
                    {sectorFilter && (
                      <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <MdKeyboardArrowRight className={`transition-transform duration-300 ${expandedSection === 'sector' ? 'rotate-90' : ''}`} />
                </button>
                
                {expandedSection === 'sector' && (
                  <div className="p-3 bg-white/5 border-t border-white/10 overflow-visible">
                    <CustomSelect
                      value={sectorFilter}
                      onChange={(value) => handleFilterChange('sector', value)}
                      options={[
                        { value: "", label: "All Sectors" },
                        ...sectors.map(sector => ({ value: sector, label: sector }))
                      ]}
                      placeholder="Select sector..."
                    />
                  </div>
                )}
              </div>
              
              {/* Collapsible Facility Size Filter */}
              <div className="mb-2 bg-[rgba(40,41,43,0.4)] rounded-lg overflow-hidden">
                <button 
                  onClick={() => toggleSection('facilitySize')}
                  className="w-full p-3 flex justify-between items-center text-white hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MdOutlineRoofing className="text-orange-400" />
                    <span className="font-medium">Facility Size</span>
                    {squareFootageFilter && (
                      <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <MdKeyboardArrowRight className={`transition-transform duration-300 ${expandedSection === 'facilitySize' ? 'rotate-90' : ''}`} />
                </button>
                
                {expandedSection === 'facilitySize' && (
                  <div className="p-3 bg-white/5 border-t border-white/10 overflow-visible">
                    <CustomSelect
                      value={squareFootageFilter}
                      onChange={(value) => handleFilterChange('squareFootage', value)}
                      options={[
                        { value: "", label: "All Facility Sizes" },
                        ...squareFootageRanges.map(range => ({ value: range, label: range }))
                      ]}
                      placeholder="Select facility size..."
                    />
                  </div>
                )}
              </div>
              
              {/* Collapsible Energy Usage Filter */}
              <div className="mb-2 bg-[rgba(40,41,43,0.4)] rounded-lg overflow-hidden">
                <button 
                  onClick={() => toggleSection('energyUsage')}
                  className="w-full p-3 flex justify-between items-center text-white hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MdOutlineElectricBolt className="text-orange-400" />
                    <span className="font-medium">Energy Usage</span>
                    {energyUsageFilter && (
                      <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <MdKeyboardArrowRight className={`transition-transform duration-300 ${expandedSection === 'energyUsage' ? 'rotate-90' : ''}`} />
                </button>
                
                {expandedSection === 'energyUsage' && (
                  <div className="p-3 bg-white/5 border-t border-white/10 overflow-visible">
                    <CustomSelect
                      value={energyUsageFilter}
                      onChange={(value) => handleFilterChange('energyUsage', value)}
                      options={[
                        { value: "", label: "All Energy Usage Levels" },
                        ...energyUsageRanges.map(range => ({ value: range, label: range }))
                      ]}
                      placeholder="Select energy usage..."
                    />
                  </div>
                )}
              </div>
              
              {/* Collapsible Verification Filters */}
              <div className="mb-2 bg-[rgba(40,41,43,0.4)] rounded-lg overflow-hidden">
                <button 
                  onClick={() => toggleSection('verification')}
                  className="w-full p-3 flex justify-between items-center text-white hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MdCheck className="text-orange-400" />
                    <span className="font-medium">Verification</span>
                    {(verifiedEmailFilter || verifiedPhoneFilter || showVerifiedOnly) && (
                      <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <MdKeyboardArrowRight className={`transition-transform duration-300 ${expandedSection === 'verification' ? 'rotate-90' : ''}`} />
                </button>
                
                {expandedSection === 'verification' && (
                  <div className="p-3 bg-white/5 border-t border-white/10">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={verifiedEmailFilter}
                          onChange={() => handleFilterChange('verifiedEmail', !verifiedEmailFilter)}
                          className="rounded border-orange-300 text-orange-500 focus:ring-orange-500 h-4 w-4 bg-white/10" 
                        />
                        <span className="text-sm text-white/80">
                          Verified Email
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={verifiedPhoneFilter}
                          onChange={() => handleFilterChange('verifiedPhone', !verifiedPhoneFilter)}
                          className="rounded border-orange-300 text-orange-500 focus:ring-orange-500 h-4 w-4 bg-white/10" 
                        />
                        <span className="text-sm text-white/80">
                          Verified Phone Number
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={showVerifiedOnly}
                          onChange={() => handleFilterChange('verified', !showVerifiedOnly)}
                          className="rounded border-orange-300 text-orange-500 focus:ring-orange-500 h-4 w-4 bg-white/10" 
                        />
                        <span className="text-sm text-white/80">
                          Full Contact Verification
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Collapsible Distribution Statistics */}
              <div className="mb-2 bg-[rgba(40,41,43,0.4)] rounded-lg overflow-hidden">
                <button 
                  onClick={() => toggleSection('sizeDistribution')}
                  className="w-full p-3 flex justify-between items-center text-white hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MdInsights className="text-orange-400" />
                    <span className="font-medium">Size Distribution</span>
                  </div>
                  <MdKeyboardArrowRight className={`transition-transform duration-300 ${expandedSection === 'sizeDistribution' ? 'rotate-90' : ''}`} />
                </button>
                
                {expandedSection === 'sizeDistribution' && (
                  <div className="p-3 bg-white/5 border-t border-white/10">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white/70">Small (≤10k sq ft)</span>
                        <span className="text-orange-400">{Math.round(facilitiesStats.small / 1000000)}M</span>
                      </div>
                      <div className="h-1.5 bg-[rgba(27,34,42,0.95)] rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: '66.5%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white/70">Medium (10k-50k)</span>
                        <span className="text-orange-400">{Math.round(facilitiesStats.medium / 1000000)}M</span>
                      </div>
                      <div className="h-1.5 bg-[rgba(27,34,42,0.95)] rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white/70">Large (&gt;50k)</span>
                        <span className="text-orange-400">{Math.round(facilitiesStats.large / 1000000)}M</span>
                      </div>
                      <div className="h-1.5 bg-[rgba(27,34,42,0.95)] rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: '8.5%' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="flex-1">
            {!showDashboard ? (
              // Welcome message and search button
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="max-w-2xl mx-auto">
                  <div className="mb-8 relative">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/20 border border-orange-500/20">
                      <MdFactory className="text-6xl text-orange-400" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 border border-blue-500/20">
                      <MdStorage className="text-3xl text-blue-400" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Discover Commercial Solar Opportunities
                  </h2>
                  <p className="text-xl text-white/80 mb-8">
                    Our database contains over 4.13 million commercial facilities across the United States. 
                    Use our advanced filters to find the perfect solar installation opportunities.
                  </p>
                  <div className="flex flex-col gap-2 items-center">
                    {Object.keys(activeFilters).length > 0 && (
                      <div className="bg-white/10 p-3 rounded-lg mb-2 w-full max-w-md">
                        <p className="text-white/70 text-sm mb-2">Searching with these filters:</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(activeFilters).map(([key, value]) => (
                            <div key={key} className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full text-xs">
                              {key}: {value.toString()}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <button
                      onClick={handleSearch}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-6 rounded-lg font-medium transition-all text-lg shadow-md hover:shadow-lg inline-flex items-center gap-2 group border border-white/20"
                    >
                      <MdSearch className="text-xl" />
                      Search Facilities
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Compact stats cards in a single row */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <StatsCard
                    title="Total Facilities"
                    value={`${(facilitiesStats.total / 1000000).toFixed(2)}M`}
                    change="+2.5% this month"
                    icon={<MdFactory className="text-white text-xl" />}
                    colorClass="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600"
                  />
                  
                  <StatsCard
                    title="High Potential Facilities"
                    value={formatNumber(facilitiesStats.highPotential)}
                    change="+3.1% this month"
                    icon={<MdSolarPower className="text-white text-xl" />}
                    colorClass="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600"
                  />
                  
                  <StatsCard
                    title="Enriched Facilities"
                    value={formatNumber(facilitiesStats.enriched)}
                    change="+5.2% this month"
                    icon={<MdCheck className="text-white text-xl" />}
                    colorClass="bg-gradient-to-br from-green-500 via-green-600 to-teal-600"
                  />
                </div>
                
                {/* Facilities Table with more compact design */}
                <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-orange-500/15 relative overflow-hidden">
                  {/* Unique gradient pattern */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 via-amber-500/20 to-orange-600/25 opacity-25"></div>
                  <div className="absolute -top-10 right-1/3 w-44 h-44 bg-gradient-to-bl from-orange-500/45 to-transparent rounded-full blur-3xl transform rotate-90"></div>
                  <div className="absolute bottom-1/4 -left-12 w-40 h-40 bg-gradient-to-tr from-amber-600/40 to-transparent rounded-full blur-2xl"></div>
                  
                  <div className="relative z-10 overflow-x-auto rounded-2xl">
                    <table className="w-full">
                      <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                          <th className="w-10 py-3 px-2">
                            <input 
                              type="checkbox" 
                              className="rounded border-orange-400 text-orange-500 focus:ring-orange-500 h-4 w-4 bg-white/10"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedFacilities(filteredFacilities.map(f => f.id));
                                } else {
                                  setSelectedFacilities([]);
                                }
                              }}
                              checked={selectedFacilities.length === filteredFacilities.length && filteredFacilities.length > 0}
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
                        {filteredFacilities.length > 0 ? (
                          filteredFacilities.map((facility) => (
                            <tr key={facility.id} className={`${
                              selectedFacilities.includes(facility.id) 
                                ? "bg-orange-500/20" 
                                : "hover:bg-white/5"
                              } transition-colors`}
                            >
                              <td className="py-2 px-2">
                                <input 
                                  type="checkbox" 
                                  className="rounded border-orange-400 text-orange-500 focus:ring-orange-500 h-4 w-4 bg-white/10"
                                  checked={selectedFacilities.includes(facility.id)}
                                  onChange={() => handleSelectFacility(facility.id)}
                                />
                              </td>
                              <td className="py-2 px-2 text-sm font-medium text-orange-400 hover:text-orange-300 cursor-pointer">{facility.name}</td>
                              <td className="py-2 px-2 text-sm text-white/80">{facility.company}</td>
                              <td className="py-2 px-2 text-sm">
                                <div className="flex items-center gap-1">
                                  {facility.emails && <MdEmail className="text-green-400 text-sm" />}
                                  {facility.phoneNumbers && <MdOutlinePhone className="text-green-400 text-sm" />}
                                </div>
                              </td>
                              <td className="py-2 px-2 text-sm text-white/80">{facility.location}</td>
                              <td className="py-2 px-2 text-sm">
                                <div className="flex gap-1">
                                  <button 
                                    onClick={() => navigate(`/facility-enrichment/${facility.id}`)}
                                    className="p-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm"
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
                                <p className="text-sm text-white/80">No facilities found</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination controls */}
                  <div className="p-3 border-t border-white/10 flex justify-between items-center">
                    <div className="text-white/70 text-xs">
                      Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to {Math.min(pagination.currentPage * pagination.itemsPerPage, facilitiesStats.filtered)} of {formatNumber(facilitiesStats.filtered)}
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={goToPrevPage}
                        disabled={pagination.currentPage <= 1}
                        className={`p-1.5 rounded-lg ${pagination.currentPage <= 1 ? 'bg-white/5 text-white/30' : 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30'} transition-colors`}
                      >
                        <MdArrowBack size={16} />
                      </button>
                      
                      <div className="px-2 py-1 rounded-lg bg-white/10 text-white/80 text-xs flex items-center">
                        {pagination.currentPage} / {formatNumber(pagination.totalPages)}
                      </div>
                      
                      <button 
                        onClick={goToNextPage}
                        disabled={pagination.currentPage >= pagination.totalPages}
                        className={`p-1.5 rounded-lg ${pagination.currentPage >= pagination.totalPages ? 'bg-white/5 text-white/30' : 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30'} transition-colors`}
                      >
                        <MdArrowForward size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Footer with database info and action button - more compact */}
                <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-orange-500/15 p-3 flex justify-between items-center mt-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-orange-500/20 backdrop-blur-sm p-2 rounded-lg">
                      <MdSolarPower className="text-orange-400 text-base" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Commercial Solar Database</p>
                      <p className="text-white/60 text-xs">{formatNumber(facilitiesStats.total)} facilities across all 50 states</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleContinue}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2 px-4 rounded-lg font-medium transition-all text-sm shadow-md hover:shadow-lg inline-flex items-center gap-2 group border border-white/20"
                  >
                    AI Analysis
                    <MdArrowForward className="group-hover:translate-x-1 transition-transform duration-300" size={14} />
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

export default FacilityDatabase;
