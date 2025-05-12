import React, { Suspense, useState, useEffect } from 'react';

// Lazy load the Spline component to avoid issues during initial render
const LazySpline = React.lazy(() => import('@splinetool/react-spline'));

interface SplineWrapperProps {
  scene: string;
  className?: string;
}

const SplineLoadingFallback = () => (
  <div className="w-full h-full flex items-center justify-center bg-transparent text-white/50">
    <div className="animate-pulse">Loading 3D Scene...</div>
  </div>
);

// Simple error boundary component
class SimpleErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-transparent text-white/50">
          <div>Failed to load 3D scene</div>
        </div>
      );
    }

    return this.props.children;
  }
}

const SplineWrapper: React.FC<SplineWrapperProps> = ({ scene, className = "" }) => {
  const [isClient, setIsClient] = useState(false);

  // Make sure we only render on client-side to avoid SSR issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <SplineLoadingFallback />;

  // Custom styling to make the 3D object larger and position it
  const splineContainerStyle = {
    transform: 'scale(2.25) translateX(5%) translateY(5%)', // Move slightly left from 10% to 5%
    transformOrigin: 'center center',
    width: '100%',
    height: '100%',
  };

  return (
    <div className={`w-full h-full overflow-hidden ${className}`}>
      <SimpleErrorBoundary>
        <Suspense fallback={<SplineLoadingFallback />}>
          <div style={splineContainerStyle}>
            <LazySpline scene={scene} />
          </div>
        </Suspense>
      </SimpleErrorBoundary>
    </div>
  );
};

export default SplineWrapper; 