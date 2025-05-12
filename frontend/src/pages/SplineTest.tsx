import React from 'react';
import SplineWrapper from '../components/SplineWrapper';

const SplineTest = () => {
  return (
    <div className="w-full h-screen bg-[#020305] flex items-center justify-center">
      <div className="w-full h-full">
        <SplineWrapper scene="https://prod.spline.design/7o3AL69KlurQ-HoD/scene.splinecode" />
      </div>
    </div>
  );
};

export default SplineTest; 