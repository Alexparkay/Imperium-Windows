import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FilterState {
  companyName: string;
  employeeCount: string;
  state: string;
  sector: string;
  revenue: string;
  erpModules: string;
  verifiedEmail: boolean;
  verifiedPhone: boolean;
  verified: boolean;
  companyType: string;
  showVerifiedOnly: boolean;
  locationFilter: string;
  industryFilter: string;
  companyTypeFilter: string;
}

interface FilterContextType {
  filters: FilterState;
  setFilter: (category: keyof FilterState, value: string | boolean) => void;
  clearFilters: () => void;
  activeFilterCount: number;
}

const initialFilters: FilterState = {
  companyName: '',
  employeeCount: '',
  state: '',
  sector: '',
  revenue: '',
  erpModules: '',
  verifiedEmail: false,
  verifiedPhone: false,
  verified: false,
  companyType: '',
  showVerifiedOnly: false,
  locationFilter: '',
  industryFilter: '',
  companyTypeFilter: ''
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  const setFilter = (category: keyof FilterState, value: string | boolean) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [category]: value
      };
      
      // Update active filter count
      const count = Object.entries(newFilters).filter(([_, val]) => {
        if (typeof val === 'string') return val !== '';
        return val === true;
      }).length;
      setActiveFilterCount(count);
      
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setActiveFilterCount(0);
  };

  return (
    <FilterContext.Provider value={{ filters, setFilter, clearFilters, activeFilterCount }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

export default FilterContext; 