// Helper functions for the Profile component

// SAP Company Data - Sample/Mock data
export const sapCompanyData = {
  companyInfo: {
    name: "Modern SAP Solutions Ltd.",
    address: "123 Enterprise Way, Tech Park, CA 94103",
    phone: "+1 (555) 123-4567",
    email: "contact@modernsapsolutions.com",
    website: "www.modernsapsolutions.com"
  },
  expertise: {
    serviceTypes: [
      "SAP Implementation", 
      "SAP Migration", 
      "SAP S/4HANA", 
      "SAP Cloud Integration", 
      "SAP Security",
      "Business Intelligence"
    ],
    certifications: [
      "SAP S/4HANA Professional Certification",
      "SAP Certified Application Associate",
      "SAP Certified Development Associate",
      "ISO 27001 Information Security"
    ]
  },
  performance: {
    completedProjects: 128,
    totalClients: 87,
    averageImplementation: "4.3 months",
    customerSatisfaction: 4.8
  },
  sapServices: {
    implementations: [
      {
        name: "S/4HANA Cloud Implementation",
        description: "Complete SAP S/4HANA cloud-based implementation services with migration from legacy systems.",
        features: ["Data Migration", "Process Integration", "Training", "24/7 Support"]
      },
      {
        name: "SAP Analytics Suite",
        description: "Business intelligence and advanced analytics implementation using SAP Analytics Cloud.",
        features: ["Dashboards", "Predictive Analytics", "Real-time Reporting", "Mobile Access"]
      }
    ],
    solutions: [
      {
        name: "SAP Fiori UX Enhancement",
        description: "Implementation of modern, responsive user experiences for SAP applications.",
        features: ["Custom App Development", "Mobile-first Design", "Role-based Interfaces"]
      },
      {
        name: "SAP Automation Suite",
        description: "Process automation and RPA solutions for SAP environments.",
        features: ["Workflow Automation", "Document Processing", "API Integration", "Bot Development"]
      }
    ]
  }
};

// Region mappings
export const regions: Record<string, { 
  countries: string[], 
  color: string, 
  center: [number, number], 
  zoom: number 
}> = {
  "North America": { 
    countries: ["United States of America", "Canada", "Mexico"], 
    color: "#047857", // emerald-700
    center: [-100, 45],
    zoom: 2
  },
  "Europe": { 
    countries: ["United Kingdom", "Germany", "France", "Italy", "Spain", "Switzerland", "Netherlands", "Belgium", "Sweden", "Norway", "Finland", "Denmark", "Poland", "Austria"],
    color: "#10B981", // emerald-500
    center: [10, 50],
    zoom: 3
  },
  "Asia Pacific": { 
    countries: ["China", "Japan", "South Korea", "India", "Australia", "New Zealand", "Singapore", "Thailand", "Malaysia", "Indonesia", "Philippines", "Vietnam"],
    color: "#34D399", // emerald-400
    center: [115, 35],
    zoom: 2
  },
  "Middle East": { 
    countries: ["United Arab Emirates", "Saudi Arabia", "Qatar", "Israel", "Egypt", "Turkey", "Oman", "Kuwait", "Bahrain"],
    color: "#065F46", // emerald-800
    center: [45, 30],
    zoom: 3
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