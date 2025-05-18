import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineCalculate, MdOutlineAnalytics, MdOutlineShowChart, MdArrowForward, MdInfoOutline, MdClose, MdZoomOutMap, MdCompare, MdOutlineSpeed, MdOutlineTimeline, MdOutlineSavings } from 'react-icons/md';
import { FaBuilding, FaChartLine, FaCalculator, FaChartBar, FaClock, FaMoneyBill, FaServer, FaPercentage, FaDatabase, FaUsers, FaExchangeAlt, FaInfoCircle, FaUserTie, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';

interface ContactInfo {
  name: string;
  title: string;
  company: string;
  location: string;
  erpSystem: string;
}

interface SAPMetrics {
  users: number;
  transactions: number;
  currentCost: number;
  optimizedCost: number;
  savingsPerYear: number;
  roi: number;
  paybackMonths: number;
}

const DataEnrichment = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [activeMetric, setActiveMetric] = useState<string | null>(null);
  
  // Personalized data for Kyle Flynn-Kasaba
  const contactInfo: ContactInfo = {
    name: "Kyle Flynn-Kasaba",
    title: "Head of IT Infrastructure",
    company: "Wood",
    location: "Houston, Texas",
    erpSystem: "SAP ECC"
  };
  
  const sapMetrics: SAPMetrics = {
    users: 36000,
    transactions: 34250000,
    currentCost: 3254000,
    optimizedCost: 1772000,
    savingsPerYear: 1482000,
    roi: 261,
    paybackMonths: 11.8
  };
  
  // Metric tooltips (information about each metric)
  const metricTooltips: Record<string, { name: string, description: string, calculation: string }> = {
    users: {
      name: "Users",
      description: "Total number of unique users in the SAP system",
      calculation: "36,000 active users across all business units"
    },
    transactions: {
      name: "Transactions",
      description: "Total number of transactions processed by the system",
      calculation: "Dialog steps (32.1M) + RFC calls (2.15M) = 34.25M transactions"
    },
    currentCost: {
      name: "Current Cost",
      description: "Total current annual cost of operating the SAP system",
      calculation: "SAP licensing ($1,905,000) + Infrastructure ($842,000) + Operations ($507,000) = $3,254,000"
    },
    optimizedCost: {
      name: "Optimized Cost",
      description: "Projected annual cost after optimization",
      calculation: "SAP licensing after reclassification ($985,000) + Optimized infra ($525,000) + Streamlined ops ($262,000) = $1,772,000"
    },
    savingsPerYear: {
      name: "Savings/yr",
      description: "Annual cost savings after optimization",
      calculation: "$3,254,000 - $1,772,000 = $1,482,000 annual savings"
    },
    roi: {
      name: "ROI",
      description: "Return on investment percentage",
      calculation: "($1,482,000 ÷ $568,000) × 100 = 261% ROI"
    },
    paybackMonths: {
      name: "Payback",
      description: "Number of months until the investment pays for itself",
      calculation: "($568,000 ÷ $1,482,000) × 12 = 4.6 months × 2.5 risk factor = 11.8 months"
    }
  };

  // Effect to simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Card base class for glassmorphic effect
  const cardBaseClass = "backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 border border-green-500/15 group relative overflow-hidden";
  
  // Card hover effect
  const cardHoverClass = "hover:shadow-[0_10px_40px_rgba(16,185,129,0.3)] hover:border-green-500/30 hover:scale-[1.01]";
  
  // Colors for charts - only green palette
  const COLORS = ['#10B981', '#047857', '#34D399', '#065F46', '#059669', '#6EE7B7', '#064E3B'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {isLoading ? (
          <div className={cardBaseClass}>
            <div className="card-body flex flex-col items-center justify-center py-16 relative z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Loading Analysis Data...
              </h3>
              <p className="text-gray-400 text-center max-w-md mb-8">
                Retrieving your SAP system analysis data...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Personalized Contact Data Section */}
            <div className={`${cardBaseClass} p-6 mb-8 overflow-hidden relative bg-gradient-to-br from-[rgba(16,185,129,0.05)] to-[rgba(16,185,129,0.01)] border-green-500/20 hover:border-green-400/30 transition-all duration-500 shadow-[0_10px_50px_rgba(16,185,129,0.2)]`}>
              {/* Decorative elements */}
              <div className="absolute -top-36 -right-36 w-96 h-96 rounded-full bg-green-500/5 blur-[100px] pointer-events-none"></div>
              <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-green-400/5 blur-[80px] pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 relative z-10">
                <div className="flex items-center space-x-5">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/30 to-green-300/20 flex items-center justify-center border border-green-400/20 shadow-lg shadow-green-900/10">
                    <FaUserTie className="text-green-400 text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">{contactInfo.name}</h2>
                    <p className="text-green-300/80 flex items-center text-lg">
                      <span className="text-gray-400 font-light">{contactInfo.title}</span>
                      <span className="mx-2 text-green-500/40">•</span>
                      <span className="text-green-300/70 font-medium">{contactInfo.company}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 mt-4 md:mt-0 text-gray-300 bg-white/5 rounded-full py-2 px-4 border border-green-500/10">
                  <FaMapMarkerAlt className="text-green-400" />
                  <span>{contactInfo.location}</span>
                  <span className="mx-1 text-green-500/40">|</span>
                  <FaDatabase className="text-green-400" />
                  <span>{contactInfo.erpSystem}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Key Metrics Overview */}
                <div className="col-span-1 rounded-2xl p-6 backdrop-blur-md bg-gradient-to-br from-[rgba(16,185,129,0.08)] to-[rgba(16,185,129,0.03)] border border-green-500/20 shadow-lg shadow-black/20 transform transition-all duration-300 hover:shadow-green-900/20 hover:border-green-400/30 hover:scale-[1.02] relative group">
                  <button 
                    onClick={() => {
                      setActiveMetric('users');
                      setShowInfoModal(true);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center hover:bg-green-500/20 transition-colors z-10"
                  >
                    <FaInfoCircle className="text-green-400 text-sm" />
                  </button>
                  
                  <h3 className="text-xl font-semibold text-white mb-5 flex items-center">
                    <FaUsers className="text-green-400 mr-2" />
                    System Users
                  </h3>
                  
                  <div className="text-center">
                    <p className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600 mb-2">{sapMetrics.users.toLocaleString()}</p>
                    <p className="text-gray-400">Total Active Users</p>
                  </div>
                </div>
                
                {/* Transactions */}
                <div className="col-span-1 rounded-2xl p-6 backdrop-blur-md bg-gradient-to-br from-[rgba(16,185,129,0.08)] to-[rgba(16,185,129,0.02)] border border-green-500/20 shadow-lg shadow-black/20 transform transition-all duration-300 hover:shadow-green-900/20 hover:border-green-400/30 hover:scale-[1.02] relative group">
                  <button 
                    onClick={() => {
                      setActiveMetric('transactions');
                      setShowInfoModal(true);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center hover:bg-green-500/20 transition-colors z-10"
                  >
                    <FaInfoCircle className="text-green-400 text-sm" />
                  </button>
                  
                  <h3 className="text-xl font-semibold text-white mb-5 flex items-center">
                    <FaExchangeAlt className="text-green-400 mr-2" />
                    Transactions
                  </h3>
                  
                  <div className="text-center">
                    <p className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600 mb-2">{(sapMetrics.transactions / 1000000).toFixed(2)}M</p>
                    <p className="text-gray-400">Annual Transactions</p>
                  </div>
                </div>
                
                {/* ROI Visualization */}
                <div className="col-span-1 rounded-2xl p-6 backdrop-blur-md bg-gradient-to-br from-[rgba(16,185,129,0.08)] to-[rgba(16,185,129,0.02)] border border-green-500/20 shadow-lg shadow-black/20 transform transition-all duration-300 hover:shadow-green-900/20 hover:border-green-400/30 hover:scale-[1.02] flex flex-col relative group">
                  <button 
                    onClick={() => {
                      setActiveMetric('roi');
                      setShowInfoModal(true);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center hover:bg-green-500/20 transition-colors z-10"
                  >
                    <FaInfoCircle className="text-green-400 text-sm" />
                  </button>
                  
                  <h3 className="text-xl font-semibold text-white mb-5 flex items-center">
                    <FaCalculator className="text-green-400 mr-2" />
                    Return on Investment
                  </h3>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex-1 flex items-center justify-center relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full bg-green-500/5 blur-[30px]"></div>
                      </div>
                      <div className="relative w-32 h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'ROI', value: Math.min(sapMetrics.roi, 300) },
                                { name: 'Base', value: 100 }
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={30}
                              outerRadius={55}
                              startAngle={90}
                              endAngle={-270}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              <Cell key="cell-0" fill="#10B981" />
                              <Cell key="cell-1" fill="#1F2937" />
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                          <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">{sapMetrics.roi}%</p>
                          <p className="text-xs text-gray-400">ROI</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                          <FaClock className="text-green-400 text-xs" />
                        </div>
                        <span className="text-gray-300 text-sm">Payback Period</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-white font-medium">{sapMetrics.paybackMonths} mo</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Cost Comparison Chart */}
              <div className="h-72 rounded-2xl p-6 backdrop-blur-md bg-gradient-to-br from-[rgba(16,185,129,0.03)] to-[rgba(16,185,129,0.08)] border border-green-500/20 shadow-lg shadow-black/20 transform transition-all duration-300 hover:shadow-green-900/20 hover:border-green-400/30 relative group">
                <button 
                  onClick={() => {
                    setActiveMetric('savingsPerYear');
                    setShowInfoModal(true);
                  }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center hover:bg-green-500/20 transition-colors z-10"
                >
                  <FaInfoCircle className="text-green-400 text-sm" />
                </button>
                
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <FaChartBar className="text-green-400 mr-2" />
                  Cost Comparison & Savings Analysis
                </h3>
                <ResponsiveContainer width="100%" height="80%">
                  <BarChart
                    data={[
                      { name: 'Current Cost', value: sapMetrics.currentCost },
                      { name: 'Optimized Cost', value: sapMetrics.optimizedCost },
                      { name: 'Annual Savings', value: sapMetrics.savingsPerYear }
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.4} />
                    <XAxis dataKey="name" tick={{ fill: '#9CA3AF' }} />
                    <YAxis tick={{ fill: '#9CA3AF' }} />
                    <Tooltip
                      formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
                      contentStyle={{ backgroundColor: 'rgba(20, 20, 25, 0.9)', borderRadius: '0.5rem', border: '1px solid rgba(16, 185, 129, 0.3)', backdropFilter: 'blur(10px)' }}
                    />
                    <Bar dataKey="value" name="Amount">
                      {[
                        <Cell key="cell-0" fill="#065F46" />,
                        <Cell key="cell-1" fill="#10B981" />,
                        <Cell key="cell-2" fill="#34D399" />
                      ] as React.ReactNode[]}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Tabs Navigation */}
            <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
              <div 
                className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer mx-1 ${selectedTab === 'overview' ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                onClick={() => setSelectedTab('overview')}
              >
                Overview
              </div>
              <div 
                className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer mx-1 ${selectedTab === 'costs' ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                onClick={() => setSelectedTab('costs')}
              >
                Cost Analysis
              </div>
              <div 
                className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer mx-1 ${selectedTab === 'performance' ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                onClick={() => setSelectedTab('performance')}
              >
                Performance
              </div>
              <div 
                className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer mx-1 ${selectedTab === 'infrastructure' ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                onClick={() => setSelectedTab('infrastructure')}
              >
                Infrastructure
              </div>
            </div>
            
            {/* Summary Section */}
            <div className={`${cardBaseClass} p-6 ${cardHoverClass}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">SAP S/4HANA Migration Analysis</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Analysis Completed</span>
                  <FaInfoCircle className="text-green-500" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4 border border-green-500/10">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Current Cost</p>
                      <p className="text-xl text-green-300 font-bold">${sapMetrics.currentCost.toLocaleString()}/yr</p>
                    </div>
                    <FaMoneyBill className="text-green-400 text-2xl opacity-80" />
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-green-500/10">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Optimized Cost</p>
                      <p className="text-xl text-green-500 font-bold">${sapMetrics.optimizedCost.toLocaleString()}/yr</p>
                    </div>
                    <MdOutlineSavings className="text-green-400 text-2xl opacity-80" />
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-green-500/10">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Annual Savings</p>
                      <p className="text-xl text-green-400 font-bold">${sapMetrics.savingsPerYear.toLocaleString()}</p>
                    </div>
                    <MdOutlineSavings className="text-green-400 text-2xl opacity-80" />
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-green-500/10">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">ROI</p>
                      <p className="text-xl text-green-400 font-bold">{sapMetrics.roi}%</p>
                    </div>
                    <FaClock className="text-green-400 text-2xl opacity-80" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-8">
                <button 
                  onClick={() => navigate('/migration-insights')}
                  className="bg-gradient-to-br from-green-500 via-green-600 to-green-600 text-white py-4 px-8 rounded-xl font-medium flex items-center space-x-2 shadow-lg shadow-green-900/20 hover:shadow-green-800/30 transition-all"
                >
                  <span className="text-lg">Continue to Migration Insights</span>
                  <MdArrowForward className="text-xl" />
                </button>
              </div>
            </div>
            
            {/* Information Modal */}
            {showInfoModal && activeMetric && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="relative max-w-md w-full bg-gradient-to-br from-[#1A1A1A]/95 via-[#1A1A1A]/90 to-[#1A1A1A]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-green-500/20 p-6 max-h-[90vh] overflow-y-auto">
                  {/* Green glow effect */}
                  <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-500/10 rounded-full blur-[60px]"></div>
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-green-500/10 rounded-full blur-[60px]"></div>
                  </div>

                  <button 
                    onClick={() => setShowInfoModal(false)}
                    className="absolute top-3 right-3 p-1 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors z-10"
                  >
                    <MdClose size={24} />
                  </button>
                  
                  <div className="mb-6 pb-4 border-b border-green-800/30 relative z-10">
                    <div className="flex items-start mb-2">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center mr-4 border border-green-500/20 shadow-lg shadow-green-900/20">
                        {activeMetric === 'users' && <FaUsers className="text-green-400 text-xl" />}
                        {activeMetric === 'transactions' && <FaExchangeAlt className="text-green-400 text-xl" />}
                        {activeMetric === 'currentCost' && <FaMoneyBillWave className="text-green-400 text-xl" />}
                        {activeMetric === 'optimizedCost' && <FaMoneyBillWave className="text-green-400 text-xl" />}
                        {activeMetric === 'savingsPerYear' && <MdOutlineSavings className="text-green-400 text-xl" />}
                        {activeMetric === 'roi' && <FaCalculator className="text-green-400 text-xl" />}
                        {activeMetric === 'paybackMonths' && <FaClock className="text-green-400 text-xl" />}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-green-200">{metricTooltips[activeMetric].name}</h3>
                        <p className="text-green-300/70">{metricTooltips[activeMetric].description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-900/20 to-green-800/10 rounded-lg p-5 border border-green-500/20 mb-6">
                    <h4 className="text-white font-medium mb-3 flex items-center">
                      <FaInfoCircle className="text-green-400 mr-2" />
                      Details
                    </h4>
                    <p className="text-white">{metricTooltips[activeMetric].calculation}</p>
                  </div>
                  
                  <div className="flex justify-end mt-6 relative z-10">
                    <button 
                      onClick={() => setShowInfoModal(false)}
                      className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-500 hover:to-green-400 transition-all font-medium shadow-lg shadow-green-900/20 hover:shadow-green-800/30 flex items-center space-x-2"
                    >
                      <span>Close</span>
                      <MdClose size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DataEnrichment; 