import React from 'react';

interface MapProviderProps {
  children: React.ReactNode;
}

const MapProvider: React.FC<MapProviderProps> = ({ children }) => {
  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
};

export default MapProvider; 