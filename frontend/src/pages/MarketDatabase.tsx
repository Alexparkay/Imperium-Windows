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

// Building types
const buildingTypes = [
  "Office Buildings",
  "Retail Centers", 
  "Industrial Facilities",
  "Warehouses",
  "Healthcare Facilities",
  "Educational Buildings",
  "Hospitality Properties",
  "Mixed-Use Developments",
  "Government Buildings",
  "Religious Buildings"
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
    highPotential: 9964,
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

  // Add Detroit as a city option for testing
  const locations = [
    "Detroit, Michigan", "Houston, Texas", "New York, New York", "Los Angeles, California", 
    "Chicago, Illinois", "Phoenix, Arizona", "Philadelphia, Pennsylvania", "San Antonio, Texas",
    "San Diego, California", "Dallas, Texas", "San Jose, California", "Austin, Texas",
    "Jacksonville, Florida", "Fort Worth, Texas", "Columbus, Ohio", "Charlotte, North Carolina",
    "San Francisco, California", "Indianapolis, Indiana", "Seattle, Washington", "Denver, Colorado",
    "Boston, Massachusetts", "El Paso, Texas", "Nashville, Tennessee", "Baltimore, Maryland",
    "Oklahoma City, Oklahoma", "Portland, Oregon", "Las Vegas, Nevada", "Louisville, Kentucky",
    "Milwaukee, Wisconsin", "Albuquerque, New Mexico", "Tucson, Arizona", "Fresno, California",
    "Sacramento, California", "Mesa, Arizona", "Kansas City, Missouri", "Atlanta, Georgia",
    "Long Beach, California", "Colorado Springs, Colorado", "Raleigh, North Carolina", "Miami, Florida",
    "Virginia Beach, Virginia", "Omaha, Nebraska", "Oakland, California", "Minneapolis, Minnesota",
    "Tulsa, Oklahoma", "Arlington, Texas", "Tampa, Florida", "New Orleans, Louisiana"
  ];

  // Building size options (square footage)
  const buildingSizes = [
    "Under 5,000 sq ft",
    "5,000 - 10,000 sq ft",
    "10,000 - 25,000 sq ft",
    "25,000 - 50,000 sq ft",
    "50,000 - 100,000 sq ft",
    "100,000 - 250,000 sq ft",
    "250,000 - 500,000 sq ft",
    "Over 500,000 sq ft"
  ];

  // Number of windows ranges
  const windowCounts = [
    "1-10 windows",
    "11-25 windows",
    "26-50 windows",
    "51-100 windows",
    "101-250 windows",
    "251-500 windows",
    "Over 500 windows"
  ];

  // Age of building ranges
  const buildingAges = [
    "Built in 2020s",
    "Built in 2010s",
    "Built in 2000s",
    "Built in 1990s",
    "Built in 1980s",
    "Built in 1970s",
    "Built before 1970"
  ];

  // Property value ranges
  const propertyValues = [
    "Under $500K",
    "$500K - $1M",
    "$1M - $2.5M",
    "$2.5M - $5M",
    "$5M - $10M",
    "$10M - $25M",
    "Over $25M"
  ];

  // Decision making authority levels
  const decisionMakingAuthority = [
    "Property Owner",
    "Property Manager",
    "Facilities Manager",
    "Building Operations Manager",
    "Maintenance Supervisor",
    "Tenant Representative",
    "Board Member",
    "Executive Decision Maker"
  ];

  // Building condition options
  const buildingConditions = [
    "Excellent",
    "Good",
    "Fair",
    "Needs Renovation",
    "Under Construction",
    "Recently Renovated"
  ];

  // Occupancy status
  const occupancyStatus = [
    "Fully Occupied",
    "Partially Occupied",
    "Vacant",
    "Under Lease",
    "For Sale",
    "For Rent"
  ];

  // Building filter states
  const [buildingNameFilter, setBuildingNameFilter] = useState('');
  const [buildingSizeFilter, setBuildingSizeFilter] = useState('');
  const [windowCountFilter, setWindowCountFilter] = useState('');
  const [buildingAgeFilter, setBuildingAgeFilter] = useState('');
  const [propertyValueFilter, setPropertyValueFilter] = useState('');
  const [decisionMakerFilter, setDecisionMakerFilter] = useState('');
  const [buildingConditionFilter, setBuildingConditionFilter] = useState('');
  const [occupancyStatusFilter, setOccupancyStatusFilter] = useState('');
  const [verifiedEmailFilter, setVerifiedEmailFilter] = useState(false);
  const [verifiedPhoneFilter, setVerifiedPhoneFilter] = useState(false);

  // Building interface based on CSV structure
  interface Building {
    id: number;
    name: string;
    jobTitle: string;
    buildingName: string;
    emails: boolean;
    phoneNumbers: boolean;
    location: string;
    enriched: boolean;
    verified: boolean;
    buildingSize: string;
    buildingType: string;
    windowCount: string;
    propertyValue: string;
    floors: string;
    year: string;
    status: string;
    address: string;
    propertyOwner: string;
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
          
          if (values.length >= 39 && rowCount <= 12) { // Only take first 12 buildings
            const building: Building = {
              id: rowCount,
              name: generateContactName(rowCount - 1), // Use fixed contact names based on index
              jobTitle: generateJobTitle(), // Generate realistic job titles
              buildingName: values[0] || '',
              emails: true,
              phoneNumbers: true,
              location: values[2] || '', // address
              enriched: false,
              verified: true,
              buildingSize: formatSquareFootage(values[7] || ''),
              buildingType: mapBuildingType(values[4] || ''),
              windowCount: formatWindowCount(values[12] || ''),
              propertyValue: estimatePropertyValue(values[7] || ''),
              floors: values[37] || '',
              year: values[36] || '',
              status: values[38] || '',
              address: values[2] || '',
              propertyOwner: values[5] || ''
            };
            buildings.push(building);
          }
          rowCount++;
        }
        currentRow = '';
      }
    }

    console.log(`Parsed ${buildings.length} buildings from CSV for Market Database`);
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

  // Helper functions for data transformation
  const extractNumericValue = (value: string): number => {
    if (!value) return 0;
    const match = value.match(/[\d,]+\.?\d*/);
    if (match) {
      return parseFloat(match[0].replace(/,/g, ''));
    }
    return 0;
  };

  const formatSquareFootage = (value: string): string => {
    const num = extractNumericValue(value);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M sq ft`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K sq ft`;
    }
    return `${num.toFixed(0)} sq ft`;
  };

  const formatWindowCount = (value: string): string => {
    const num = extractNumericValue(value);
    if (num > 500) return "500+ windows";
    if (num > 250) return "251-500 windows";
    if (num > 100) return "101-250 windows";
    if (num > 50) return "51-100 windows";
    if (num > 25) return "26-50 windows";
    if (num > 10) return "11-25 windows";
    return "1-10 windows";
  };

  const mapBuildingType = (type: string): string => {
    const typeMap: { [key: string]: string } = {
      'mixed-use': 'Mixed-Use Developments',
      'residential high-rise': 'Residential Buildings',
      'office': 'Office Buildings',
      'retail': 'Retail Centers',
      'industrial': 'Industrial Facilities',
      'warehouse': 'Warehouses',
      'healthcare': 'Healthcare Facilities',
      'educational': 'Educational Buildings',
      'hospitality': 'Hospitality Properties',
      'government': 'Government Buildings',
      'religious': 'Religious Buildings'
    };
    
    const lowerType = type.toLowerCase();
    for (const [key, value] of Object.entries(typeMap)) {
      if (lowerType.includes(key)) {
        return value;
      }
    }
    return 'Office Buildings'; // Default
  };

  const estimatePropertyValue = (squareFootage: string): string => {
    const sqft = extractNumericValue(squareFootage);
    if (sqft > 500000) return "Over $25M";
    if (sqft > 250000) return "$10M-$25M";
    if (sqft > 100000) return "$5M-$10M";
    if (sqft > 50000) return "$2.5M-$5M";
    if (sqft > 25000) return "$1M-$2.5M";
    if (sqft > 10000) return "$500K-$1M";
    return "Under $500K";
  };

  // Fixed contact names for consistent display
  const fixedContactNames = [
    "Michael Chen",
    "John Smith",
    "Sarah Johnson", 
    "Emily Rodriguez",
    "David Wilson",
    "Lisa Thompson",
    "Robert Garcia",
    "Jennifer Lee",
    "Mark Anderson",
    "Amanda White",
    "Carlos Martinez",
    "Rachel Brown"
  ];

  const generateContactName = (index: number): string => {
    return fixedContactNames[index] || fixedContactNames[0];
  };

  const generateJobTitle = (): string => {
    const titles = ["Property Manager", "Facilities Manager", "Building Operations Manager", "Property Owner", "Maintenance Supervisor"];
    return titles[Math.floor(Math.random() * titles.length)];
  };

  // Building data state
  const [buildings, setBuildings] = useState<Building[]>([]);

  // Load CSV data on component mount
  useEffect(() => {
    const loadCSVData = async () => {
      try {
        console.log('Loading CSV data for Market Database...');
        const response = await fetch('/Spreadsheet/LuxWall - High rise Buildings - Detroit Michigan - Complete_Detroit_Highrise_Database-Default-view-export-1747802457903 (1).csv');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        console.log('CSV text length:', csvText.length);
        
        const parsedBuildings = parseCSV(csvText);
        console.log('Parsed buildings for Market Database:', parsedBuildings.length);
        
        setBuildings(parsedBuildings);
        
        // Update stats with actual data
        setCompaniesStats(prev => ({
          ...prev,
          filtered: parsedBuildings.length
        }));
        
      } catch (error) {
        console.error('Error loading CSV data:', error);
        
        // Fallback sample data
        const sampleBuildings: Building[] = [
          {
            id: 1,
            name: "John Smith",
            jobTitle: "Property Manager",
            buildingName: "MGM Grand Detroit Hotel & Casino",
            emails: true,
            phoneNumbers: true,
            location: "Detroit, Michigan",
            enriched: false,
            verified: true,
            buildingSize: "1.7M sq ft",
            buildingType: "Mixed-Use Developments",
            windowCount: "500+ windows",
            propertyValue: "Over $25M",
            floors: "17",
            year: "2008",
            status: "built",
            address: "1777 3rd Ave, Detroit, MI 48226",
            propertyOwner: "Vici Properties and MGM Resorts International"
          }
        ];
        
        setBuildings(sampleBuildings);
        setCompaniesStats(prev => ({
          ...prev,
          filtered: sampleBuildings.length
        }));
      }
    };

    loadCSVData();
  }, []);

  // Custom select component with portal for guaranteed top-level rendering
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
    const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    // Update button position when dropdown opens
    useEffect(() => {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setButtonRect(rect);
      }
    }, [isOpen]);
    
    // Handle clicks outside dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          buttonRef.current && 
          !buttonRef.current.contains(event.target as Node) &&
          dropdownRef.current && 
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);
    
    // Handle scroll to update position
    useEffect(() => {
      const handleScroll = () => {
        if (isOpen && buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          setButtonRect(rect);
        }
      };
      
      if (isOpen) {
        window.addEventListener('scroll', handleScroll, true);
        return () => window.removeEventListener('scroll', handleScroll, true);
      }
    }, [isOpen]);
    
    const selectedOption = options.find(option => option.value === value);
    
    // Calculate dropdown position
    const dropdownStyle = buttonRect ? {
      position: 'fixed' as const,
      top: buttonRect.bottom + 4,
      left: buttonRect.left,
      width: buttonRect.width,
      zIndex: 999999
    } : {};
    
    return (
      <>
        <button
          ref={buttonRef}
          type="button"
          className="w-full py-2 px-3 rounded-lg border border-white/20 bg-[#28292b] backdrop-blur-sm text-white focus:ring-2 focus:ring-[#2a64f5] focus:border-transparent transition-all flex justify-between items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={`${!selectedOption ? 'text-white/50' : 'text-white'} truncate pr-2`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <MdKeyboardArrowRight className={`transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-90' : ''}`} />
        </button>
        
        {isOpen && buttonRect && createPortal(
          <div 
            ref={dropdownRef}
            style={dropdownStyle}
            className="rounded-md bg-[#28292b] border border-white/10 shadow-2xl max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800"
          >
            <div className="py-1">
              {options.map((option) => (
                <div
                  key={option.value}
                  className={`cursor-pointer select-none relative py-2 px-3 ${
                    option.value === value 
                      ? 'bg-gradient-to-r from-[#2a64f5]/40 to-[#7a94b8]/30 text-white' 
                      : 'text-white/70 hover:bg-gradient-to-r hover:from-[#2a64f5]/5 hover:via-[#7a94b8]/3 hover:to-[#7a94b8]/5'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
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
      </>
    );
  };

  const [activeFilters, setActiveFilters] = useState<{[key: string]: string | boolean | string[]}>({});
  const [stateFilter, setStateFilter] = useState('');
  const [buildingTypeFilter, setBuildingTypeFilter] = useState<string[]>([]);

  // Toggle filter sections
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const handleFilterChange = (category: string, value: string | boolean | string[]) => {
    
    // Update the corresponding state variable first
    switch (category) {
      case 'buildingName':
        setBuildingNameFilter(value as string);
        break;
      case 'buildingSize':
        setBuildingSizeFilter(value as string);
        break;
      case 'windowCount':
        setWindowCountFilter(value as string);
        break;
      case 'buildingAge':
        setBuildingAgeFilter(value as string);
        break;
      case 'propertyValue':
        setPropertyValueFilter(value as string);
        break;
      case 'decisionMaker':
        setDecisionMakerFilter(value as string);
        break;
      case 'buildingCondition':
        setBuildingConditionFilter(value as string);
        break;
      case 'occupancyStatus':
        setOccupancyStatusFilter(value as string);
        break;
      case 'state':
        setStateFilter(value as string);
        break;
      case 'buildingType':
        setBuildingTypeFilter(value as string[]);
        break;
      case 'verifiedEmail':
        setVerifiedEmailFilter(value as boolean);
        break;
      case 'verifiedPhone':
        setVerifiedPhoneFilter(value as boolean);
        break;
    }

    // Update activeFilters state
    if ((typeof value === 'string' && value === '') || (Array.isArray(value) && value.length === 0)) {
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
    // Update enriched count based on filtered count, but keep highPotential fixed at 9964
    setCompaniesStats(prev => ({
      ...prev,
      enriched: 0,
      highPotential: 9964,
    }));
  }, [companiesStats.filtered]);

  // Update the clearAllFilters function
  const clearAllFilters = () => {
    setBuildingNameFilter('');
    setBuildingSizeFilter('');
    setWindowCountFilter('');
    setBuildingAgeFilter('');
    setPropertyValueFilter('');
    setDecisionMakerFilter('');
    setBuildingConditionFilter('');
    setOccupancyStatusFilter('');
    setStateFilter('');
    setBuildingTypeFilter([]);
    setVerifiedEmailFilter(false);
    setVerifiedPhoneFilter(false);
    setActiveFilters({});
    
    // Reset filtered count to total, but keep highPotential fixed at 9964
    setCompaniesStats(prev => ({
      ...prev,
      filtered: prev.total,
      highPotential: 9964,
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
      
      // Add new buildings with required building properties
      setBuildings(prev => [
        ...prev,
        {
          id: 15,
          name: generateContactName(0),
          jobTitle: "Property Manager",
          buildingName: "Enterprise Office Complex",
          emails: true,
          phoneNumbers: true,
          location: "Austin, TX",
          enriched: true,
          verified: true,
          buildingSize: "180,000 sq ft",
          buildingType: "Office Buildings",
          windowCount: "251-500 windows",
          propertyValue: "$15M-$25M",
          floors: "22",
          year: "2018",
          status: "built",
          address: "123 Enterprise Blvd, Austin, TX",
          propertyOwner: "Enterprise Properties"
        },
        {
          id: 16,
          name: generateContactName(1),
          jobTitle: "Facilities Manager",
          buildingName: "Tech Solutions Campus",
          emails: true,
          phoneNumbers: true,
          location: "Chandler, AZ",
          enriched: true,
          verified: true,
          buildingSize: "120,000 sq ft",
          buildingType: "Office Buildings",
          windowCount: "101-250 windows",
          propertyValue: "$10M-$25M",
          floors: "15",
          year: "2020",
          status: "built",
          address: "456 Tech Way, Chandler, AZ",
          propertyOwner: "Tech Solutions LLC"
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
      
      // Update enriched buildings
      setBuildings(prev => prev.map(building => {
        if (selectedCompanies.includes(building.id)) {
          return {
            ...building,
            enriched: true
          };
        }
        return building;
      }));
      
      setSelectedCompanies([]);
    }, 2000);
  };

  const handleContinue = () => {
    if (buildings.filter(f => f.enriched).length === 0) {
      toast.error('Please enrich at least one building before continuing');
      return;
    }
    navigate('/building-enrichment');
  };

  const handleSelectBuilding = (id: number) => {
    setSelectedCompanies(prev => {
      if (prev.includes(id)) {
        return prev.filter(buildingId => buildingId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Helper function to generate random gradient patterns
  const getRandomGradient = () => {
    const patterns = [
      {
        base: "bg-gradient-to-tr from-blue-500/30 via-blue-500/20 to-green-600/15",
        blobs: [
          "absolute -top-20 left-1/4 w-40 h-40 bg-gradient-to-br from-blue-500/40",
          "absolute bottom-1/3 -right-10 w-32 h-32 bg-gradient-to-tl from-blue-500/30",
          "absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-green-600/25"
        ]
      },
      {
        base: "bg-gradient-to-bl from-green-600/30 via-emerald-600/20 to-blue-500/15",
        blobs: [
          "absolute top-1/3 -left-16 w-48 h-48 bg-gradient-to-tr from-blue-500/40",
          "absolute -bottom-10 right-1/4 w-36 h-36 bg-gradient-to-bl from-blue-500/35",
          "absolute top-1/4 right-1/3 w-28 h-28 bg-gradient-to-tr from-green-600/30"
        ]
      },
      {
        base: "bg-gradient-to-r from-blue-500/30 via-blue-500/20 to-green-600/25",
        blobs: [
          "absolute -top-10 right-1/3 w-44 h-44 bg-gradient-to-bl from-blue-500/45",
          "absolute bottom-1/4 -left-12 w-40 h-40 bg-gradient-to-tr from-emerald-600/40",
          "absolute top-2/3 right-1/4 w-32 h-32 bg-gradient-to-bl from-blue-500/35"
        ]
      }
    ];
    return patterns[Math.floor(Math.random() * patterns.length)];
  };

  // Function to get filtered buildings
  const getFilteredBuildings = () => {
    // Return all buildings by default
    return buildings;
  };

  // Get filtered buildings
  const filteredBuildings = getFilteredBuildings();

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
      <div className={`backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/40 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 border border-blue-500/20 hover:-translate-y-1 relative overflow-hidden group`}>
        {/* Enhanced gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-blue-500/20 to-teal-500/30 opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-blue-500/40 to-transparent rounded-full blur-2xl transform rotate-12 opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-tr from-teal-500/30 to-transparent rounded-full blur-xl transform -rotate-12 opacity-80 group-hover:opacity-90"></div>
        <div className="absolute top-1/3 -right-8 w-20 h-20 bg-gradient-to-bl from-blue-500/30 to-transparent rounded-full blur-lg transform rotate-45 opacity-70"></div>
        
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
            <div className={`rounded-2xl p-3 ${colorClass} shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300 backdrop-blur-md border border-white/20`}>
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
          ? 'bg-gradient-to-r from-blue-500 to-green-600 text-white shadow-lg shadow-blue-500/20' 
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
        filtered: buildings.length
      }));
      
      // Update page stats
      setPagination(prev => ({
        ...prev,
        currentPage: 1,
        totalPages: Math.ceil(buildings.length / prev.itemsPerPage)
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
    }, 5000); // 5 second delay
  };

  return (
    <div className="w-full px-32 py-12 bg-[#020305] min-h-screen relative">
      {/* Background gradient orbs */}
      <div className="fixed top-20 right-40 w-96 h-96 bg-gradient-to-br from-[#2a64f5]/5 to-transparent rounded-full blur-3xl transform rotate-12 opacity-70 pointer-events-none"></div>
      <div className="fixed bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-[#2a64f5]/5 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-60 pointer-events-none"></div>

      {/* Main content with single scrollbar */}
      <div className="flex flex-col">
        {/* Header with title and stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#2a64f5] via-[#7a94b8] to-[#0a8a5c] p-3 rounded-xl text-white shadow-lg shadow-[#2a64f5]/20">
              <MdBusinessCenter className="text-xl" />
            </div>
            <h1 className="text-2xl font-bold text-white">Market Database</h1>
          </div>
          
          {showDashboard && (
            <div className="text-white/70 text-sm flex items-center gap-2">
              <MdInfoOutline className="text-[#2a64f5]" />
              <span>Showing <span className="text-[#2a64f5] font-medium">{formatNumber(companiesStats.filtered)}</span> of {formatNumber(companiesStats.total)} companies</span>
              
              <button 
                onClick={clearAllFilters}
                className="ml-4 px-3 py-1 text-xs text-[#2a64f5] hover:text-[#7a94b8] bg-[#2a64f5]/10 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
        
        {/* Main content area */}
        <div className="flex gap-6">
          {/* Filter sidebar - now wider */}
          <div className="w-96 backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/40 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-[#2a64f5]/20 overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Filters</h2>
                {Object.keys(activeFilters).length > 0 && (
                  <button 
                    onClick={clearAllFilters}
                    className="px-3 py-1 text-xs text-[#2a64f5] hover:text-[#7a94b8] bg-[#2a64f5]/10 rounded-lg transition-colors border border-[#2a64f5]/20"
                  >
                    Clear All
                  </button>
                )}
              </div>
              


              {/* Active filters display */}
              {Object.keys(activeFilters).length > 0 && (
                <div className="mb-4 p-3 bg-[rgba(40,41,43,0.6)] rounded-xl border border-[#2a64f5]/10">
                  <h3 className="text-sm font-medium text-white/80 mb-2">Active Filters:</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(activeFilters).map(([key, value]) => {
                      if (value === '' || value === false) return null;
                      
                      const formatFilterLabel = (key: string) => {
                        return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                      };
                      
                      const formatFilterValue = (key: string, value: string | boolean | string[]) => {
                        if (typeof value === 'boolean') {
                          return value ? 'Yes' : 'No';
                        }
                        if (Array.isArray(value)) {
                          return value.join(', ');
                        }
                        return value;
                      };
                      
                      return (
                        <div 
                          key={key}
                          className="inline-flex items-center gap-2 py-1 px-3 rounded-full text-sm font-medium bg-gradient-to-r from-[#2a64f5]/40 to-[#7a94b8]/30 text-white border border-[#2a64f5]/20 shadow-sm shadow-[#2a64f5]/10 transition-all hover:shadow-md hover:scale-105"
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
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#2a64f5]/40 scrollbar-track-white/5">
              {/* Collapsible Building Name Filter */}
                <div className="mb-3 bg-[rgba(40,41,43,0.4)] rounded-lg overflow-visible border border-white/5 hover:border-[#2a64f5]/20 transition-colors">
                <button
                  onClick={() => toggleSection('buildingName')}
                    className="w-full p-3.5 flex justify-between items-center text-white hover:bg-[#2a64f5]/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                      <div className="bg-[#2a64f5]/20 p-2 rounded-lg">
                        <MdOutlineBusiness className="text-[#2a64f5]" />
                      </div>
                    <span className="font-medium">Building Name</span>
                    {buildingNameFilter && buildingNameFilter !== '' && (
                        <span className="text-xs bg-[#2a64f5]/20 text-[#2a64f5] px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <MdKeyboardArrowRight className={`transition-transform duration-300 ${expandedSection === 'buildingName' ? 'rotate-90' : ''}`} />
                </button>
                
                  <div className={`overflow-hidden transition-all duration-300 ${expandedSection === 'buildingName' ? 'max-h-[200px]' : 'max-h-0'}`}>
                  <div className="p-3 bg-[rgba(40,41,43,0.2)]">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search building name..."
                        value={buildingNameFilter}
                        onChange={(e) => handleFilterChange('buildingName', e.target.value)}
                          className="w-full py-2 px-3 rounded-lg border border-white/20 bg-[#28292b] backdrop-blur-sm text-white focus:ring-2 focus:ring-[#2a64f5] focus:border-transparent transition-all"
                      />
                      <MdSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                    </div>
                  </div>
                  </div>
              </div>
              
              {/* Collapsible Building Size Filter */}
                <div className="mb-3 bg-[rgba(40,41,43,0.4)] rounded-lg overflow-visible border border-white/5 hover:border-[#2a64f5]/20 transition-colors">
                <button
                  onClick={() => toggleSection('buildingSize')}
                    className="w-full p-3.5 flex justify-between items-center text-white hover:bg-[#2a64f5]/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                      <div className="bg-[#2a64f5]/20 p-2 rounded-lg">
                        <MdOutlineRoofing className="text-[#2a64f5]" />
                      </div>
                    <span className="font-medium">Building Size</span>
                    {buildingSizeFilter && buildingSizeFilter !== '' && (
                        <span className="text-xs bg-[#2a64f5]/20 text-[#2a64f5] px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <MdKeyboardArrowRight className={`transition-transform duration-300 ${expandedSection === 'buildingSize' ? 'rotate-90' : ''}`} />
                </button>
                
                  <div className={`overflow-hidden transition-all duration-300 ${expandedSection === 'buildingSize' ? 'max-h-[200px]' : 'max-h-0'}`}>
                  <div className="p-3 bg-[rgba(40,41,43,0.2)]">
                    <CustomSelect
                      value={buildingSizeFilter}
                      onChange={(value) => handleFilterChange('buildingSize', value)}
                      options={buildingSizes.map(size => ({ value: size, label: size }))}
                      placeholder="Select building size..."
                    />
                  </div>
                  </div>
              </div>
              
              {/* Collapsible Window Count Filter */}
                <div className="mb-3 bg-[rgba(40,41,43,0.4)] rounded-lg overflow-visible border border-white/5 hover:border-[#2a64f5]/20 transition-colors">
                <button
                  onClick={() => toggleSection('windowCount')}
                    className="w-full p-3.5 flex justify-between items-center text-white hover:bg-[#2a64f5]/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                      <div className="bg-[#2a64f5]/20 p-2 rounded-lg">
                        <MdOutlineWbSunny className="text-[#2a64f5]" />
                      </div>
                    <span className="font-medium">Number of Windows</span>
                    {windowCountFilter && windowCountFilter !== '' && (
                        <span className="text-xs bg-[#2a64f5]/20 text-[#2a64f5] px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <MdKeyboardArrowRight className={`transition-transform duration-300 ${expandedSection === 'windowCount' ? 'rotate-90' : ''}`} />
                </button>
                
                  <div className={`overflow-hidden transition-all duration-300 ${expandedSection === 'windowCount' ? 'max-h-[200px]' : 'max-h-0'}`}>
                  <div className="p-3 bg-[rgba(40,41,43,0.2)]">
                    <CustomSelect
                      value={windowCountFilter}
                      onChange={(value) => handleFilterChange('windowCount', value)}
                      options={windowCounts.map(count => ({ value: count, label: count }))}
                      placeholder="Select window count..."
                    />
                  </div>
                  </div>
              </div>
              
              {/* Collapsible Location Filter */}
                <div className="mb-3 bg-[rgba(40,41,43,0.4)] rounded-lg overflow-visible border border-white/5 hover:border-[#2a64f5]/20 transition-colors">
                <button
                  onClick={() => toggleSection('location')}
                    className="w-full p-3.5 flex justify-between items-center text-white hover:bg-[#2a64f5]/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                      <div className="bg-[#2a64f5]/20 p-2 rounded-lg">
                        <MdLocationOn className="text-[#2a64f5]" />
                      </div>
                    <span className="font-medium">Location</span>
                    {stateFilter && stateFilter !== '' && (
                        <span className="text-xs bg-[#2a64f5]/20 text-[#2a64f5] px-2 py-0.5 rounded-full">
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
                      options={locations.map(location => ({ value: location, label: location }))}
                      placeholder="Select location..."
                    />
                  </div>
                  </div>
              </div>
              
              {/* Collapsible Building Type Filter */}
                <div className="mb-3 bg-[rgba(40,41,43,0.4)] rounded-lg overflow-visible border border-white/5 hover:border-[#2a64f5]/20 transition-colors">
                <button
                  onClick={() => toggleSection('buildingType')}
                    className="w-full p-3.5 flex justify-between items-center text-white hover:bg-[#2a64f5]/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                      <div className="bg-[#2a64f5]/20 p-2 rounded-lg">
                        <MdHomeWork className="text-[#2a64f5]" />
                      </div>
                    <span className="font-medium">Building Type</span>
                    {buildingTypeFilter && buildingTypeFilter.length > 0 && (
                        <span className="text-xs bg-[#2a64f5]/20 text-[#2a64f5] px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <MdKeyboardArrowRight className={`transition-transform duration-300 ${expandedSection === 'buildingType' ? 'rotate-90' : ''}`} />
                </button>
                
                  <div className={`overflow-hidden transition-all duration-300 ${expandedSection === 'buildingType' ? 'max-h-[200px]' : 'max-h-0'}`}>
                  <div className="p-3 bg-[rgba(40,41,43,0.2)]">
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {buildingTypes.map((type) => (
                        <label key={type} className="flex items-center gap-2 text-white cursor-pointer hover:bg-white/5 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={buildingTypeFilter.includes(type)}
                            onChange={(e) => {
                              const newSelection = e.target.checked
                                ? [...buildingTypeFilter, type]
                                : buildingTypeFilter.filter(t => t !== type);
                              handleFilterChange('buildingType', newSelection);
                            }}
                            className="rounded border-[#2a64f5] text-[#2a64f5] focus:ring-[#2a64f5] h-4 w-4 bg-white/10"
                          />
                          <span className="text-sm">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  </div>
              </div>
              
              {/* Collapsible Building Age Filter */}
                <div className="mb-3 bg-[rgba(40,41,43,0.4)] rounded-lg overflow-visible border border-white/5 hover:border-[#2a64f5]/20 transition-colors">
                <button
                  onClick={() => toggleSection('buildingAge')}
                    className="w-full p-3.5 flex justify-between items-center text-white hover:bg-[#2a64f5]/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                      <div className="bg-[#2a64f5]/20 p-2 rounded-lg">
                        <MdAccessTime className="text-[#2a64f5]" />
                      </div>
                    <span className="font-medium">Building Age</span>
                    {buildingAgeFilter && buildingAgeFilter !== '' && (
                        <span className="text-xs bg-[#2a64f5]/20 text-[#2a64f5] px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <MdKeyboardArrowRight className={`transition-transform duration-300 ${expandedSection === 'buildingAge' ? 'rotate-90' : ''}`} />
                </button>
                
                  <div className={`overflow-hidden transition-all duration-300 ${expandedSection === 'buildingAge' ? 'max-h-[200px]' : 'max-h-0'}`}>
                  <div className="p-3 bg-[rgba(40,41,43,0.2)]">
                    <CustomSelect
                      value={buildingAgeFilter}
                      onChange={(value) => handleFilterChange('buildingAge', value)}
                      options={buildingAges.map(age => ({ value: age, label: age }))}
                      placeholder="Select building age..."
                    />
                  </div>
                  </div>
              </div>
              
              {/* Collapsible Property Value Filter */}
                <div className="mb-3 bg-[rgba(40,41,43,0.4)] rounded-lg overflow-visible border border-white/5 hover:border-[#2a64f5]/20 transition-colors">
                <button
                  onClick={() => toggleSection('propertyValue')}
                    className="w-full p-3.5 flex justify-between items-center text-white hover:bg-[#2a64f5]/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                      <div className="bg-[#2a64f5]/20 p-2 rounded-lg">
                        <MdAttachMoney className="text-[#2a64f5]" />
                      </div>
                    <span className="font-medium">Property Value</span>
                    {propertyValueFilter && propertyValueFilter !== '' && (
                        <span className="text-xs bg-[#2a64f5]/20 text-[#2a64f5] px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <MdKeyboardArrowRight className={`transition-transform duration-300 ${expandedSection === 'propertyValue' ? 'rotate-90' : ''}`} />
                </button>
                
                  <div className={`overflow-hidden transition-all duration-300 ${expandedSection === 'propertyValue' ? 'max-h-[200px]' : 'max-h-0'}`}>
                  <div className="p-3 bg-[rgba(40,41,43,0.2)]">
                    <CustomSelect
                      value={propertyValueFilter}
                      onChange={(value) => handleFilterChange('propertyValue', value)}
                      options={propertyValues.map(value => ({ value: value, label: value }))}
                      placeholder="Select property value..."
                    />
                  </div>
                  </div>
              </div>
              
              {/* Collapsible Decision Maker Filter */}
                <div className="mb-3 bg-[rgba(40,41,43,0.4)] rounded-lg overflow-visible border border-white/5 hover:border-[#2a64f5]/20 transition-colors">
                <button
                  onClick={() => toggleSection('decisionMaker')}
                    className="w-full p-3.5 flex justify-between items-center text-white hover:bg-[#2a64f5]/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                      <div className="bg-[#2a64f5]/20 p-2 rounded-lg">
                        <MdBusinessCenter className="text-[#2a64f5]" />
                      </div>
                    <span className="font-medium">Decision Making Authority</span>
                    {decisionMakerFilter && decisionMakerFilter !== '' && (
                        <span className="text-xs bg-[#2a64f5]/20 text-[#2a64f5] px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <MdKeyboardArrowRight className={`transition-transform duration-300 ${expandedSection === 'decisionMaker' ? 'rotate-90' : ''}`} />
                </button>
                
                  <div className={`overflow-hidden transition-all duration-300 ${expandedSection === 'decisionMaker' ? 'max-h-[200px]' : 'max-h-0'}`}>
                  <div className="p-3 bg-[rgba(40,41,43,0.2)]">
                    <CustomSelect
                      value={decisionMakerFilter}
                      onChange={(value) => handleFilterChange('decisionMaker', value)}
                      options={decisionMakingAuthority.map(authority => ({ value: authority, label: authority }))}
                      placeholder="Select decision maker..."
                    />
                  </div>
                  </div>
              </div>
              
              {/* Collapsible Building Condition Filter */}
                <div className="mb-3 bg-[rgba(40,41,43,0.4)] rounded-lg overflow-visible border border-white/5 hover:border-[#2a64f5]/20 transition-colors">
                <button
                  onClick={() => toggleSection('buildingCondition')}
                    className="w-full p-3.5 flex justify-between items-center text-white hover:bg-[#2a64f5]/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                      <div className="bg-[#2a64f5]/20 p-2 rounded-lg">
                        <MdShowChart className="text-[#2a64f5]" />
                      </div>
                    <span className="font-medium">Building Condition</span>
                    {buildingConditionFilter && buildingConditionFilter !== '' && (
                        <span className="text-xs bg-[#2a64f5]/20 text-[#2a64f5] px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <MdKeyboardArrowRight className={`transition-transform duration-300 ${expandedSection === 'buildingCondition' ? 'rotate-90' : ''}`} />
                </button>
                
                  <div className={`overflow-hidden transition-all duration-300 ${expandedSection === 'buildingCondition' ? 'max-h-[200px]' : 'max-h-0'}`}>
                  <div className="p-3 bg-[rgba(40,41,43,0.2)]">
                    <CustomSelect
                      value={buildingConditionFilter}
                      onChange={(value) => handleFilterChange('buildingCondition', value)}
                      options={buildingConditions.map(condition => ({ value: condition, label: condition }))}
                      placeholder="Select building condition..."
                    />
                  </div>
                  </div>
              </div>
              
              {/* Collapsible Occupancy Status Filter */}
                <div className="mb-3 bg-[rgba(40,41,43,0.4)] rounded-lg overflow-visible border border-white/5 hover:border-[#2a64f5]/20 transition-colors">
                <button
                  onClick={() => toggleSection('occupancyStatus')}
                    className="w-full p-3.5 flex justify-between items-center text-white hover:bg-[#2a64f5]/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                      <div className="bg-[#2a64f5]/20 p-2 rounded-lg">
                        <MdDashboard className="text-[#2a64f5]" />
                      </div>
                    <span className="font-medium">Occupancy Status</span>
                    {occupancyStatusFilter && occupancyStatusFilter !== '' && (
                        <span className="text-xs bg-[#2a64f5]/20 text-[#2a64f5] px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <MdKeyboardArrowRight className={`transition-transform duration-300 ${expandedSection === 'occupancyStatus' ? 'rotate-90' : ''}`} />
                </button>
                
                  <div className={`overflow-hidden transition-all duration-300 ${expandedSection === 'occupancyStatus' ? 'max-h-[200px]' : 'max-h-0'}`}>
                  <div className="p-3 bg-[rgba(40,41,43,0.2)]">
                    <CustomSelect
                      value={occupancyStatusFilter}
                      onChange={(value) => handleFilterChange('occupancyStatus', value)}
                      options={occupancyStatus.map(status => ({ value: status, label: status }))}
                      placeholder="Select occupancy status..."
                    />
                  </div>
                  </div>
              </div>
              
              {/* Collapsible Verification Filter */}
                <div className="mb-3 bg-[rgba(40,41,43,0.4)] rounded-lg overflow-visible border border-white/5 hover:border-[#2a64f5]/20 transition-colors">
                <button
                  onClick={() => toggleSection('verification')}
                    className="w-full p-3.5 flex justify-between items-center text-white hover:bg-[#2a64f5]/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                      <div className="bg-[#2a64f5]/20 p-2 rounded-lg">
                        <MdCheck className="text-[#2a64f5]" />
                      </div>
                    <span className="font-medium">Verification</span>
                    {(verifiedEmailFilter || verifiedPhoneFilter) && (
                        <span className="text-xs bg-[#2a64f5]/20 text-[#2a64f5] px-2 py-0.5 rounded-full">
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
                            className="rounded border-[#2a64f5] text-[#2a64f5] focus:ring-[#2a64f5] h-4 w-4 bg-white/10"
                        />
                        <span>Verified Emails</span>
                      </label>
                      
                      <label className="flex items-center gap-2 text-white">
                        <input
                          type="checkbox"
                          checked={verifiedPhoneFilter}
                          onChange={(e) => handleFilterChange('verifiedPhone', e.target.checked)}
                            className="rounded border-[#2a64f5] text-[#2a64f5] focus:ring-[#2a64f5] h-4 w-4 bg-white/10"
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
                  className="w-full bg-gradient-to-r from-[#2a64f5] to-[#7a94b8] hover:from-[#7a94b8] hover:to-[#0a8a5c] text-white py-3 px-4 rounded-lg font-medium transition-all text-sm shadow-md hover:shadow-xl flex items-center justify-center gap-2 group border border-white/20 relative overflow-hidden"
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
                          className="absolute h-2 w-2 rounded-full bg-[#2a64f5]"
                          style={{
                            animation: `particle${i + 1} 5s infinite linear`,
                            opacity: 0.7,
                          }}
                        ></div>
                      ))}
                    </div>
                    
                    <div className="relative h-32 w-32 mx-auto">
                      {/* Spinner rings */}
                      <div className="absolute inset-0 rounded-full border-4 border-[#2a64f5]/20 animate-ping"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-[#2a64f5]/30 animate-pulse"></div>
                      
                      {/* Main spinner */}
                      <div className="h-full w-full animate-spin rounded-full border-4 border-[#2a64f5] border-t-transparent flex items-center justify-center">
                        <div className="h-24 w-24 rounded-full border-4 border-[#2a64f5]/40 border-b-transparent animate-spin"></div>
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
                      <div className="h-8 w-8 rounded-full bg-[#2a64f5]/20 flex items-center justify-center">
                        <MdSearch className="text-[#2a64f5]" />
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-[#2a64f5]/20 rounded-full overflow-hidden relative">
                          <div className="absolute top-0 left-0 h-full bg-[#2a64f5] animate-[searchingData_1.5s_ease-in-out_forwards]"></div>
                        </div>
                      </div>
                      <span className="text-sm text-white/60">Searching</span>
                    </div>
                    
                    <div className="flex items-center gap-3 opacity-0 animate-[fadeIn_0.5s_ease-in-out_1.5s_forwards]">
                      <div className="h-8 w-8 rounded-full bg-[#2a64f5]/20 flex items-center justify-center">
                        <MdFilterList className="text-[#2a64f5]" />
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-[#2a64f5]/20 rounded-full overflow-hidden relative">
                          <div className="absolute top-0 left-0 h-full bg-[#2a64f5] animate-[filteringData_1.5s_ease-in-out_forwards_1.5s]"></div>
                        </div>
                      </div>
                      <span className="text-sm text-white/60">Filtering</span>
                    </div>
                    
                    <div className="flex items-center gap-3 opacity-0 animate-[fadeIn_0.5s_ease-in-out_3s_forwards]">
                      <div className="h-8 w-8 rounded-full bg-[#2a64f5]/20 flex items-center justify-center">
                        <MdDataUsage className="text-[#2a64f5]" />
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-[#2a64f5]/20 rounded-full overflow-hidden relative">
                          <div className="absolute top-0 left-0 h-full bg-[#2a64f5] animate-[analyzingData_1.5s_ease-in-out_forwards_3s]"></div>
                        </div>
                      </div>
                      <span className="text-sm text-white/60">Analyzing</span>
                    </div>
                    
                    <div className="flex items-center gap-3 opacity-0 animate-[fadeIn_0.5s_ease-in-out_4.5s_forwards]">
                      <div className="h-8 w-8 rounded-full bg-[#2a64f5]/20 flex items-center justify-center animate-pulse">
                        <MdCheck className="text-[#2a64f5]" />
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-[#2a64f5]/20 rounded-full overflow-hidden relative">
                          <div className="absolute top-0 left-0 h-full bg-[#2a64f5] animate-[finalizing_0.5s_ease-in-out_forwards_4.5s]"></div>
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
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#2a64f5]/20 via-[#2a64f5]/10 to-transparent rounded-3xl flex items-center justify-center shadow-2xl shadow-[#2a64f5]/20 border border-[#2a64f5]/20">
                      <MdBusinessCenter className="text-6xl text-[#2a64f5]" />
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
                    We have identified <span className="text-[#2a64f5] font-semibold">426,000</span> facilities which are eligible. Use the filters to narrow down your selection and obtain the specific demographic that matches your target audience.
                  </p>
                  
                  {/* Previous Lists Section */}
                  <div className="mb-10 bg-white/5 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4 text-left">Previous Lists</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 transition-all hover:shadow-lg cursor-pointer text-left">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-md bg-[#2a64f5]/20">
                            <MdInsights className="text-[#2a64f5]" />
                          </div>
                          <div>
                            <h4 className="font-medium text-white">Manufacturing Sector - Q2 2023</h4>
                            <p className="text-sm text-white/70 mt-1">143 contacts • Last updated 2 weeks ago</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 transition-all hover:shadow-lg cursor-pointer text-left">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-md bg-[#2a64f5]/20">
                            <MdInsights className="text-[#2a64f5]" />
                          </div>
                          <div>
                            <h4 className="font-medium text-white">Financial Services - High Value</h4>
                            <p className="text-sm text-white/70 mt-1">67 contacts • Last updated 1 month ago</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 transition-all hover:shadow-lg cursor-pointer text-left">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-md bg-[#2a64f5]/20">
                            <MdOutlineStarOutline className="text-[#2a64f5]" />
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
                            <div key={key} className="bg-[#2a64f5]/20 text-[#2a64f5] px-2 py-0.5 rounded-full text-xs">
                              {key}: {value.toString()}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <button
                      onClick={handleSearch}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-[#2a64f5] to-[#7a94b8] hover:from-[#7a94b8] hover:to-[#0a8a5c] text-white py-3 px-6 rounded-lg font-medium transition-all text-lg shadow-md hover:shadow-lg inline-flex items-center gap-2 group border border-white/20"
                    >
                      {isLoading ? (
                        <>
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                      <MdSearch className="text-xl" />
                      Search Buildings
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Filter criteria summary */}
                <div className="mb-4 py-3 px-4 backdrop-blur-md bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/40 to-[rgba(40,41,43,0.2)] rounded-xl border border-[#2a64f5]/15 text-white/80">
                  <p className="flex items-center gap-2">
                    <FaFilter className="text-[#2a64f5] text-sm" />
                    <span className="text-sm">Criteria: <span className="font-medium text-white">Facility Managers</span> in <span className="font-medium text-white">Detroit</span> with <span className="font-medium text-white">verified emails</span> and <span className="font-medium text-white">phone numbers</span></span>
                    <span className="ml-auto text-[#2a64f5] font-medium">14 Back end data points</span>
                  </p>
                </div>
              
                {/* Stats cards */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <StatsCard
                    title="Total Contacts"
                    value="14.5K"
                    change="+2.5% this month"
                    icon={<MdBusinessCenter className="text-white text-xl" />}
                    colorClass="bg-gradient-to-br from-[#2a64f5] via-[#7a94b8] to-[#0a8a5c]"
                  />
                  
                  <StatsCard
                    title="High Potential Buildings"
                    value="9,964"
                    change="+3.1% this month"
                    icon={<MdDataUsage className="text-white text-xl" />}
                    colorClass="bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600"
                  />
                  
                  <StatsCard
                    title="Enriched Buildings"
                    value="0"
                    change="+0.0% this month"
                    icon={<MdCheck className="text-white text-xl" />}
                    colorClass="bg-gradient-to-br from-blue-500 via-emerald-600 to-[#2a64f5]"
                  />
                </div>
                
                {/* Buildings table */}
                <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-[#2a64f5]/15 relative overflow-hidden">
                  {/* Table content */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#2a64f5]/30 via-[#7a94b8]/20 to-[#0a8a5c]/25 opacity-25"></div>
                  <div className="absolute -top-10 right-1/3 w-44 h-44 bg-gradient-to-bl from-[#2a64f5]/45 to-transparent rounded-full blur-3xl transform rotate-90"></div>
                  <div className="absolute bottom-1/4 -left-12 w-40 h-40 bg-gradient-to-tr from-[#7a94b8]/40 to-transparent rounded-full blur-2xl"></div>
                  
                  <div className="relative z-10 overflow-x-auto rounded-2xl">
                    <table className="w-full">
                      <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                          <th className="w-10 py-3 px-2">
                            <input 
                              type="checkbox" 
                              className="rounded border-[#2a64f5] text-[#2a64f5] focus:ring-[#2a64f5] h-4 w-4 bg-white/10"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCompanies(buildings.map(f => f.id));
                                } else {
                                  setSelectedCompanies([]);
                                }
                              }}
                              checked={selectedCompanies.length === buildings.length && buildings.length > 0}
                            />
                          </th>
                          <th className="py-3 px-2 text-left text-xs font-medium text-white uppercase tracking-wider">Contact Name</th>
                          <th className="py-3 px-2 text-left text-xs font-medium text-white uppercase tracking-wider">Job Title</th>
                          <th className="py-3 px-2 text-left text-xs font-medium text-white uppercase tracking-wider">Building Name</th>
                          <th className="py-3 px-2 text-left text-xs font-medium text-white uppercase tracking-wider">Contact Info</th>
                          <th className="py-3 px-2 text-left text-xs font-medium text-white uppercase tracking-wider">Location</th>
                          <th className="py-3 px-2 text-left text-xs font-medium text-white uppercase tracking-wider">Building Type</th>
                          <th className="py-3 px-2 text-left text-xs font-medium text-white uppercase tracking-wider">Size</th>
                          <th className="py-3 px-2 text-left text-xs font-medium text-white uppercase tracking-wider">Floors</th>
                          <th className="py-3 px-2 text-left text-xs font-medium text-white uppercase tracking-wider">Year Built</th>
                          <th className="py-3 px-2 text-left text-xs font-medium text-white uppercase tracking-wider">Windows</th>
                          <th className="py-3 px-2 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {buildings.map((building) => (
                            <tr key={building.id} className={`${
                              selectedCompanies.includes(building.id) 
                              ? "bg-[#2a64f5]/20" 
                                : "hover:bg-white/5"
                              } transition-colors`}
                            >
                              <td className="py-2 px-2">
                                <input 
                                  type="checkbox" 
                                className="rounded border-[#2a64f5] text-[#2a64f5] focus:ring-[#2a64f5] h-4 w-4 bg-white/10"
                                  checked={selectedCompanies.includes(building.id)}
                                  onChange={() => handleSelectBuilding(building.id)}
                                />
                              </td>
                            <td className="py-2 px-2 text-sm font-medium text-[#2a64f5] hover:text-[#7a94b8] cursor-pointer">{building.name}</td>
                            <td className="py-2 px-2 text-sm text-white/80">{building.jobTitle}</td>
                              <td className="py-2 px-2 text-sm text-white/80">{building.buildingName}</td>
                              <td className="py-2 px-2 text-sm">
                                <div className="flex items-center gap-1">
                                {building.emails && <MdEmail className="text-[#2a64f5] text-sm" />}
                                {building.phoneNumbers && <MdOutlinePhone className="text-[#2a64f5] text-sm" />}
                                </div>
                              </td>
                              <td className="py-2 px-2 text-sm text-white/80">{building.location}</td>
                            <td className="py-2 px-2 text-sm text-white/80">{building.buildingType}</td>
                              <td className="py-2 px-2 text-sm text-white/80">{building.buildingSize}</td>
                              <td className="py-2 px-2 text-sm text-white/80">{building.floors}</td>
                              <td className="py-2 px-2 text-sm text-white/80">{building.year}</td>
                              <td className="py-2 px-2 text-sm text-white/80">{building.windowCount}</td>
                              <td className="py-2 px-2 text-sm">
                                <div className="flex gap-1">
                                  <button 
                                    onClick={() => {
                                      // Store the filtered buildings in localStorage so SignalScanner can use them
                                      try {
                                      localStorage.setItem('filteredBuildings', JSON.stringify(buildings));
                                      } catch (error) {
                                        console.error('Error saving filtered buildings to localStorage', error);
                                      }
                                      navigate('/signal-scanner');
                                    }}
                                  className="p-1.5 rounded-lg bg-gradient-to-r from-[#2a64f5] to-[#7a94b8] text-white shadow-sm"
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
                    Showing <span className="text-white">1-{buildings.length}</span> of <span className="text-white">{formatNumber(companiesStats.total)}</span> contacts
                  </div>
                  <div className="flex gap-1">
                      <button 
                      className="bg-white/10 text-white/70 px-3 py-1 rounded-md hover:bg-white/20 transition-all disabled:opacity-50"
                      disabled={pagination.currentPage === 1}
                      >
                      Previous
                      </button>
                    <button className="bg-gradient-to-r from-[#2a64f5] to-[#7a94b8] text-white px-3 py-1 rounded-md hover:from-[#7a94b8] hover:to-[#0a8a5c] transition-all">1</button>
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
                      // Store the filtered buildings in localStorage so SignalScanner can use them
                      try {
                        localStorage.setItem('filteredBuildings', JSON.stringify(buildings));
                      } catch (error) {
                        console.error('Error saving filtered buildings to localStorage', error);
                      }
                      navigate('/signal-scanner');
                    }}
                    className="bg-gradient-to-r from-[#2a64f5] to-[#7a94b8] hover:from-[#7a94b8] hover:to-[#0a8a5c] text-white py-2 px-6 rounded-lg font-medium transition-all text-sm shadow-md hover:shadow-lg inline-flex items-center gap-2 group border border-white/20"
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
