import React from 'react';
import USAMap from "react-usa-map";

interface USMapProps {
  className?: string;
}

interface StateConfig {
  fill: string;
}

type StatesConfig = {
  [key: string]: StateConfig;
};

const USMap: React.FC<USMapProps> = ({ className }) => {
  // Handler for when a state is clicked
  const mapHandler = (event: any) => {
    const stateName = event.target.dataset.name;
    console.log(`Selected state: ${stateName}`);
  };

  // Custom configuration for states with higher activity
  const statesCustomConfig: StatesConfig = {
    CA: { fill: "rgba(249, 115, 22, 0.85)" },
    FL: { fill: "rgba(249, 115, 22, 0.8)" },
    TX: { fill: "rgba(249, 115, 22, 0.85)" },
    NY: { fill: "rgba(249, 115, 22, 0.8)" },
    WA: { fill: "rgba(249, 115, 22, 0.75)" },
    OR: { fill: "rgba(249, 115, 22, 0.75)" },
    NV: { fill: "rgba(249, 115, 22, 0.75)" },
    AZ: { fill: "rgba(249, 115, 22, 0.75)" },
    CO: { fill: "rgba(249, 115, 22, 0.75)" },
    IL: { fill: "rgba(249, 115, 22, 0.75)" },
    GA: { fill: "rgba(249, 115, 22, 0.75)" }
  };

  // Generate configuration for remaining states
  const allStates = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
  
  allStates.forEach(state => {
    if (!statesCustomConfig[state]) {
      statesCustomConfig[state] = {
        fill: "rgba(249, 115, 22, 0.6)"
      };
    }
  });

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-xl" />
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <USAMap
          customize={statesCustomConfig}
          onClick={mapHandler}
          defaultFill="rgba(249, 115, 22, 0.6)"
          title="Select a state"
        />
      </div>
    </div>
  );
};

export default USMap; 