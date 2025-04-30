declare module 'react-usa-map' {
  interface CustomizeState {
    fill?: string;
    clickHandler?: () => void;
  }

  interface USAMapProps {
    customize?: Record<string, CustomizeState>;
    onClick?: (event: React.MouseEvent<SVGElement>) => void;
    defaultFill?: string;
    title?: string;
    width?: string | number;
    height?: string | number;
  }

  const USAMap: React.FC<USAMapProps>;
  export default USAMap;
} 