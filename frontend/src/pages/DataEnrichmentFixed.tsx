import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineCalculate, MdOutlineAnalytics, MdOutlineShowChart, MdArrowForward, MdInfoOutline, MdClose, MdZoomOutMap } from 'react-icons/md';
import { FaBuilding, FaChartLine, FaCalculator, FaChartBar, FaClock, FaMoneyBill, FaServer, FaTools, FaPercentage, FaDatabase, FaDesktop, FaUsers, FaNetworkWired, FaFileAlt, FaBolt, FaRegLightbulb } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, XAxis, YAxis, CartesianGrid, ReferenceLine, Area, AreaChart } from 'recharts';

const DataEnrichment = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false); // Set to false to show the main content

  // Simplified data structure
  const sapMigrationData = {
    totalAnnualCost: '$4,287,650',
    averageMonthlySpend: '$357,304',
    costWithS4HANA: '$3,215,738',
    costWithoutS4HANA: '$4,287,650',
    roiPeriod: '2.1 years',
    moduleUsageBreakdown: {
      financials: 32,
      materials: 24,
      sales: 18,
      production: 14,
      other: 12
    }
  };

  // Card base class
  const cardBaseClass = "backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 border border-green-500/15 group relative overflow-hidden";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {isCalculating ? (
          <div className={cardBaseClass}>
            <div className="card-body flex flex-col items-center justify-center py-16 relative z-10">
              <h3 className="text-2xl font-bold text-transparent mb-4">
                Calculating Data...
              </h3>
              <p className="text-gray-400 text-center max-w-md mb-8">
                Please wait while we analyze your data...
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className={cardBaseClass + " p-6"}>
              <h2 className="text-xl font-bold text-white mb-4">SAP Migration Analysis</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">Annual Cost Without S/4HANA</p>
                  <p className="text-xl text-red-500">{sapMigrationData.costWithoutS4HANA}</p>
                </div>
                <div>
                  <p className="text-gray-400">Annual Cost With S/4HANA</p>
                  <p className="text-xl text-green-500">{sapMigrationData.costWithS4HANA}</p>
                </div>
                <div>
                  <p className="text-gray-400">ROI Period</p>
                  <p className="text-xl text-white">{sapMigrationData.roiPeriod}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button 
                onClick={() => navigate('/migration-insights')}
                className="bg-gradient-to-br from-green-500 via-green-600 to-green-600 text-white py-4 px-8 rounded-xl font-medium"
              >
                <span className="relative z-10 text-lg">Continue to Migration Insights</span>
                <MdArrowForward className="relative z-10 text-2xl" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DataEnrichment; 