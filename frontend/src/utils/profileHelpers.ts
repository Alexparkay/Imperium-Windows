// Helper functions for the Profile component

// LuxWall Company Data - Vacuum Insulated Glass Technology Company
export const luxwallCompanyData = {
  companyInfo: {
    name: "LuxWall",
    address: "Litchfield, Michigan, USA",
    phone: "+1 (555) LUXWALL",
    email: "contact@luxwall.com",
    website: "www.luxwall.com",
    founded: "2016",
    founder: "Scott Thomsen"
  },
  technology: {
    flagship: "Enthermal™ Vacuum Insulating Glass",
    description: "Proprietary vacuum insulated glass (VIG) technology that significantly improves building energy efficiency",
    keyFeatures: [
      "Vacuum Chamber Design",
      "Proprietary Spacers", 
      "Edge Sealing Technology",
      "Multiple Pane Options",
      "Low-E Coatings"
    ]
  },
  products: [
    {
      name: "Enthermal™ VIG Standard",
      description: "Second-generation vacuum insulating glass for direct replacement applications",
      icon: "🏢", // Building icon for standard applications
      detailedDescription: "Our flagship product designed for direct replacement in existing window frames. Offers superior thermal performance with minimal disruption during installation.",
      documentationUrl: "https://www.luxwall.com/wp-content/uploads/Enthermal-R18-Product-Data-Sheet_050725_LW00041.3.pdf",
      specifications: {
        rValue: "R18-R21",
        uFactor: "0.05-0.06",
        thermalImprovement: "16.33x over traditional windows",
        soundReduction: "42-45 dB",
        uvBlocking: "99.6%",
        serviceLife: "25+ years"
      },
      features: ["Direct Replacement", "Existing Frame Compatible", "Minimal Performance Degradation"]
    },
    {
      name: "Enthermal™ VIG Commercial",
      description: "High-performance vacuum glass for commercial and high-rise applications",
      icon: "🏗️", // Construction/commercial icon
      detailedDescription: "Engineered for large-scale commercial installations with custom sizing options. Perfect for curtain walls and high-rise buildings requiring maximum energy efficiency.",
      documentationUrl: "https://www.luxwall.com/wp-content/uploads/Enthermal-Plus-R21-Product-Data-Sheet_050525_LW00054.1.pdf",
      specifications: {
        minSize: "10\" x 10\"",
        maxSize: "72\" x 144\"",
        thickness: "6mm-12mm",
        standardThickness: "8.3mm"
      },
      features: ["Curtain Wall Compatible", "Storefront Systems", "Custom Architectural Frames"]
    },
    {
      name: "Enthermal™ VIG Residential",
      description: "Premium vacuum insulated glass for luxury residential towers",
      icon: "🏠", // House icon for residential
      detailedDescription: "Designed specifically for high-end residential applications. Combines superior energy performance with aesthetic appeal for luxury homes and condominiums.",
      documentationUrl: "https://www.luxwall.com/wp-content/uploads/Enthermal-R18-Product-Data-Sheet_050725_LW00041.3.pdf",
      specifications: {
        energySavings: "Up to 45% reduction",
        coolingReduction: "30-40%",
        heatingReduction: "35-50%"
      },
      features: ["Aluminum Frames", "Vinyl Frames", "Wood Frames", "Fiberglass Frames"]
    }
  ],
  markets: {
    primary: [
      "Commercial Office Buildings",
      "Mixed-Use Developments", 
      "Institutional Buildings",
      "Luxury Residential Towers",
      "Hotels and Hospitality"
    ],
    buildingRequirements: {
      optimalHeight: "4+ stories (best ROI: 15+ stories)",
      windowWallRatio: ">30% for best performance",
      buildingAge: "Most effective in pre-2000 buildings",
      noHeightLimit: "Suitable for super-tall skyscrapers"
    }
  },
  performance: {
    energyCostReduction: "29.2%",
    windowEnergyReduction: "Up to 45%",
    averageROI: "3.17 years",
    fastROI: "Under 1 year (some properties)",
    co2Reduction: "350-1,200 metric tons annually",
    carbonPayback: "6-9 months"
  },
  manufacturing: {
    facilities: [
      {
        location: "Litchfield, Michigan",
        status: "Operational (2024)",
        investment: "$165 million",
        jobs: "450+ planned"
      },
      {
        location: "Detroit, Michigan", 
        status: "In Development",
        funding: "$31.7 million federal grant"
      }
    ]
  },
  funding: {
    seriesB: "$51 million (October 2024)",
    seriesA: "$33 million (early 2023)",
    valuation: "$101 million",
    keyInvestors: ["Breakthrough Energy Ventures (Bill Gates)", "Climate Investment", "Barclays Sustainable Impact Capital"],
    governmentSupport: ["$31.7 million federal grant", "$6 million Michigan Strategic Fund"]
  },
  certifications: [
    "NFRC Ratings Certified",
    "LEED Points Contributor (6-10 points)",
    "Energy Star Qualified",
    "ASHRAE 90.1 Compliant",
    "Michigan Energy Code Exceeds Requirements"
  ],
  partnerships: [
    "Kolbe Windows & Doors (February 2024)",
    "Dan Gilbert Organization (Detroit projects)",
    "Premium Glass Manufacturers"
  ]
};

// Keep the existing sapCompanyData for backward compatibility
export const sapCompanyData = luxwallCompanyData;

// Region mappings - Updated for LuxWall's geographic focus with blue color scheme
export const regions: Record<string, { 
  countries: string[], 
  color: string, 
  center: [number, number], 
  zoom: number 
}> = {
  "North America": { 
    countries: ["United States of America", "Canada", "Mexico"], 
    color: "#1e40af", // blue-800 - dark blue
    center: [-100, 45],
    zoom: 2
  },
  "Europe": { 
    countries: ["United Kingdom", "Germany", "France", "Italy", "Spain", "Switzerland", "Netherlands", "Belgium", "Sweden", "Norway", "Finland", "Denmark", "Poland", "Austria"],
    color: "#3b82f6", // blue-500 - medium blue
    center: [10, 50],
    zoom: 3
  },
  "Asia Pacific": { 
    countries: ["China", "Japan", "South Korea", "India", "Australia", "New Zealand", "Singapore", "Thailand", "Malaysia", "Indonesia", "Philippines", "Vietnam"],
    color: "#60a5fa", // blue-400 - light blue
    center: [115, 35],
    zoom: 2
  },
  "Future Markets": { 
    countries: ["Brazil", "Argentina", "Chile", "South Africa", "Nigeria", "Kenya"],
    color: "#1e3a8a", // blue-900 - darkest blue
    center: [-30, -15],
    zoom: 2
  }
};

// Find the region a country belongs to
export const findCountryRegion = (countryName: string): string | null => {
  for (const [region, data] of Object.entries(regions)) {
    if (data.countries.includes(countryName)) {
      return region;
    }
  }
  return null;
};

// Check if a country is in one of the selected regions
export const isInSelectedRegions = (countryName: string, selectedRegions: string[] = []): boolean => {
  const countryRegion = findCountryRegion(countryName);
  return countryRegion ? selectedRegions.includes(countryRegion) : false;
};

// Format functions
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};

export const handleStateChange = (state: string, setSelectedState: React.Dispatch<React.SetStateAction<string | null>>) => {
  setSelectedState(state);
};

export const handleRegionToggle = (region: string, selectedRegions: string[], setSelectedRegions: React.Dispatch<React.SetStateAction<string[]>>) => {
  if (selectedRegions.includes(region)) {
    setSelectedRegions(selectedRegions.filter(r => r !== region));
  } else {
    setSelectedRegions([...selectedRegions, region]);
  }
};

export const handleCountryToggle = (country: string, selectedCountries: string[], setSelectedCountries: React.Dispatch<React.SetStateAction<string[]>>) => {
  if (selectedCountries.includes(country)) {
    setSelectedCountries(selectedCountries.filter(c => c !== country));
  } else {
    setSelectedCountries([...selectedCountries, country]);
  }
}; 