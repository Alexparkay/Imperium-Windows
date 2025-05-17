import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineCalculate, MdOutlineAnalytics, MdOutlineShowChart, MdArrowForward, MdInfoOutline, MdClose, MdZoomOutMap, MdCompare, MdOutlineSpeed, MdOutlineTimeline, MdOutlineSavings, MdOutlineAssessment, MdOutlineEngineering, MdPerson, MdBusiness, MdLocationOn, MdInfo, MdCalculate } from 'react-icons/md';
import { FaBuilding, FaChartLine, FaCalculator, FaChartBar, FaClock, FaMoneyBill, FaServer, FaTools, FaPercentage, FaDatabase, FaDesktop, FaUsers, FaNetworkWired, FaFileAlt, FaBolt, FaRegLightbulb, FaRegSave, FaRegChartBar, FaExchangeAlt, FaCheckCircle, FaTimesCircle, FaCloud, FaCloudUploadAlt, FaUser, FaEnvelope, FaPhone, FaBuilding as FaBuildingIcon, FaMapMarkerAlt, FaUserTie, FaUserCog, FaExchangeAlt as FaExchangeAltIcon, FaMoneyBillWave, FaInfoCircle, FaQuestionCircle, FaCalculator as FaCalculatorIcon } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, XAxis, YAxis, CartesianGrid, ReferenceLine, Area, AreaChart, BarChart, Bar, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface ModuleBreakdown {
  name: string;
  value: number;
  color: string;
}

interface CostBreakdown {
  name: string;
  currentCost: number;
  cloudCost: number;
}

interface SavingsTimeline {
  name: string;
  savings: number;
  migration: number;
}

interface InfrastructureStats {
  name: string;
  current: number;
  afterMigration: number;
}

interface SystemMetrics {
  name: string;
  value: number;
  minimum: number;
  maximum: number;
  ideal: number;
}

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
  licenceRate: number;
  throughput: number;
  efficiency: number;
  currentCost: number;
  optimizedCost: number;
  savingsPerYear: number;
  roi: number;
  paybackMonths: number;
  performanceScore: number;
}

interface MetricTooltip {
  name: string;
  formula: string;
  description?: string;
  calculation?: string;
  example?: string;
}

const DataEnrichment = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<string | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [activeMetric, setActiveMetric] = useState<string | null>(null);
  
  // Contact information and personalized SAP metrics
  const contactInfo: ContactInfo = {
    name: "Kyle Flynn-Kasaba",
    title: "Head of IT Infrastructure and Operations",
    company: "Wood",
    location: "Houston, Texas",
    erpSystem: "SAP ECC"
  };
  
  const sapMetrics: SAPMetrics = {
    users: 36000,
    transactions: 34250000,
    licenceRate: 0.095,
    throughput: 9850,
    efficiency: 44,
    currentCost: 3254000,
    optimizedCost: 1772000,
    savingsPerYear: 1482000,
    roi: 261,
    paybackMonths: 11.8,
    performanceScore: 8.5
  };
  
  const metricTooltips: Record<string, MetricTooltip> = {
    // Individual metrics
    users: {
      name: "Users",
      formula: "COUNT(unique user_id) from SAP USR02 or USMM",
      description: "Total number of unique users in the SAP system",
      calculation: "Extracted directly from SAP USR02 table with unique user IDs filtered to exclude technical users",
      example: "36,000 active users across all business units"
    },
    transactions: {
      name: "Transactions",
      formula: "SUM of dialog steps + RFC calls (ST03N/STAD)",
      description: "Total number of transactions processed by the system",
      calculation: "Dialog steps (32.1M) + RFC calls (2.15M) = 34.25M transactions",
      example: "Dialog steps from web interface, RFC calls from API integrations"
    },
    licenceRate: {
      name: "Licence Rate",
      formula: "Current Cost / Transactions",
      description: "Cost per transaction in the current system",
      calculation: "$3,254,000 / 34,250,000 transactions = $0.095 per transaction",
      example: "Each transaction costs approximately 9.5 cents to process"
    },
    throughput: {
      name: "Throughput",
      formula: "Transactions / Time window (or max 5-min slice)",
      description: "Number of transactions processed per second",
      calculation: "Based on peak processing period: 2,955,000 transactions / 300 seconds = 9,850 TPS",
      example: "System handles 9,850 transactions per second at peak load"
    },
    efficiency: {
      name: "Efficiency",
      formula: "Throughput / (CPU cores × 2000 SAPS ÷ 1000)",
      description: "Measure of how efficiently the system utilizes resources",
      calculation: "9,850 / (112 cores × 2000 SAPS ÷ 1000) = 44% efficiency",
      example: "Currently utilizing only 44% of theoretical maximum capacity"
    },
    currentCost: {
      name: "Current Cost",
      formula: "SAP invoice + Infra/OPEX",
      description: "Total current annual cost of operating the SAP system",
      calculation: "SAP licensing ($1,905,000) + Infrastructure ($842,000) + Operations ($507,000) = $3,254,000",
      example: "Annual cost breakdown across licensing, infrastructure, and operations"
    },
    optimizedCost: {
      name: "Optimized Cost",
      formula: "After reclassification, discount & cleanup",
      description: "Projected annual cost after optimization",
      calculation: "SAP licensing after reclassification ($985,000) + Optimized infra ($525,000) + Streamlined ops ($262,000) = $1,772,000",
      example: "43.7% savings through license optimization, infrastructure consolidation, and operational improvements"
    },
    savingsPerYear: {
      name: "Savings/yr",
      formula: "Current Cost − Optimized Cost",
      description: "Annual cost savings after optimization",
      calculation: "$3,254,000 - $1,772,000 = $1,482,000 annual savings",
      example: "Savings fund other digital transformation initiatives and improve profitability"
    },
    roi: {
      name: "ROI",
      formula: "(Savings ÷ Migration Cost) × 100",
      description: "Return on investment percentage",
      calculation: "($1,482,000 ÷ $568,000) × 100 = 261% ROI",
      example: "Every dollar invested returns $2.61 in savings"
    },
    paybackMonths: {
      name: "Payback",
      formula: "(Migration Cost ÷ Savings) × 12",
      description: "Number of months until the investment pays for itself",
      calculation: "($568,000 ÷ $1,482,000) × 12 = 4.6 months × 2.5 risk factor = 11.8 months",
      example: "Investment recovered in less than one year, even with conservative risk adjustment"
    },
    performanceScore: {
      name: "Performance Score",
      formula: "Weighted average based on ST03/ST06 logs",
      description: "Overall performance score based on system logs",
      calculation: "Response time (6.2) + Throughput (9.8) + CPU utilization (11.5) + DB performance (7.1) + Memory usage (8.1) = 8.5%",
      example: "Score considers multiple performance dimensions weighted by importance"
    },
    
    // Widget-level metrics
    system_metrics: {
      name: "System Metrics Overview",
      formula: "Multiple metrics measuring SAP system performance and capacity",
      description: "Complete overview of key SAP system metrics and performance indicators",
      calculation: "Collection of related metrics: Users, Transactions, Throughput, Efficiency, and Performance Score",
      example: "Provides a holistic view of the system's operational characteristics and capacity"
    },
    financial_metrics: {
      name: "Financial Metrics Overview",
      formula: "Cost, savings, and financial efficiency metrics",
      description: "Financial analysis of SAP system operation and optimization opportunities",
      calculation: "Current Cost → Optimized Cost → Savings calculations with per-transaction efficiency metrics",
      example: "Shows the complete financial impact of SAP system optimization"
    },
    roi_metrics: {
      name: "ROI Analysis",
      formula: "Return on investment and payback period calculations",
      description: "Analysis of investment return and time to recover investment costs",
      calculation: "Multiple ROI calculations considering direct and indirect benefits with payback timeframe",
      example: "Visualizes the ROI percentage and months to break-even on S/4HANA migration"
    },
    cost_comparison: {
      name: "Cost Comparison Analysis",
      formula: "Comparative visualization of current costs, optimized costs, and savings",
      description: "Visual breakdown of cost structures before and after optimization",
      calculation: "Current annual costs ($3,254,000) compared with optimized costs ($1,772,000) and resulting savings ($1,482,000)",
      example: "Provides a visual understanding of the financial impact of optimization"
    }
  };
  
  // Enhanced data structure for SAP Migration Analysis
  const sapMigrationData = {
    // Basic financial data
    totalAnnualCost: '$4,287,650',
    averageMonthlySpend: '$357,304',
    costWithS4HANA: '$3,215,738',
    costWithoutS4HANA: '$4,287,650',
    roiPeriod: '2.1 years',
    
    // Detailed financial breakdown
    implementationCost: '$1,250,000',
    trainingCost: '$175,000',
    consultingFees: '$380,000',
    hardwareUpgrades: '$220,000',
    softwareLicenses: '$435,000',
    maintenanceReduction: '38%',
    operationalCostReduction: '42%',
    annualCloudCost: '$905,250',
    fiveYearTCO: '$7,776,250',
    
    // Business metrics
    processingSpeedImprovement: '67%',
    reportingTimeReduction: '82%',
    systemAvailabilityImprovement: '99.98%',
    dataProcessingCapacity: '3.2x',
    userProductivityGain: '17.5%',
    
    // Technical specifications
    serverReduction: '74%',
    databaseSize: '12.8 TB',
    integratedSystems: 14,
    apiConnections: 87,
    customCode: '145,000 lines',
    moduleComplexity: 'High',
    
    // Module usage breakdown
    moduleUsageBreakdown: [
      { name: 'Financials', value: 32, color: '#10B981' },
      { name: 'Materials', value: 24, color: '#047857' },
      { name: 'Sales', value: 18, color: '#34D399' },
      { name: 'Production', value: 14, color: '#065F46' },
      { name: 'Human Resources', value: 8, color: '#059669' },
      { name: 'Other', value: 4, color: '#064E3B' }
    ],
    
    // Cost comparison by department
    costBreakdown: [
      { name: 'IT Operations', currentCost: 1250000, cloudCost: 325000 },
      { name: 'Infrastructure', currentCost: 950000, cloudCost: 180000 },
      { name: 'Development', currentCost: 785000, cloudCost: 490000 },
      { name: 'Support', currentCost: 650000, cloudCost: 250000 },
      { name: 'Training', currentCost: 285000, cloudCost: 120000 },
      { name: 'Licensing', currentCost: 367650, cloudCost: 285738 }
    ],
    
    // Projected savings timeline
    savingsTimeline: [
      { name: 'Q1', savings: 145000, migration: 480000 },
      { name: 'Q2', savings: 240000, migration: 350000 },
      { name: 'Q3', savings: 310000, migration: 280000 },
      { name: 'Q4', savings: 390000, migration: 140000 },
      { name: 'Year 2 Q1', savings: 425000, migration: 0 },
      { name: 'Year 2 Q2', savings: 445000, migration: 0 },
      { name: 'Year 2 Q3', savings: 458000, migration: 0 },
      { name: 'Year 2 Q4', savings: 468000, migration: 0 }
    ],
    
    // Infrastructure statistics
    infrastructureStats: [
      { name: 'Servers', current: 35, afterMigration: 9 },
      { name: 'Databases', current: 18, afterMigration: 4 },
      { name: 'Storage (TB)', current: 28, afterMigration: 14 },
      { name: 'Network Load (Gbps)', current: 12, afterMigration: 7 },
      { name: 'Maintenance Hours', current: 1200, afterMigration: 320 }
    ],
    
    // System performance metrics
    systemMetrics: [
      { name: 'Response Time (ms)', value: 230, minimum: 150, maximum: 2000, ideal: 200 },
      { name: 'Transaction Speed', value: 1850, minimum: 500, maximum: 2000, ideal: 1900 },
      { name: 'User Capacity', value: 2800, minimum: 1000, maximum: 3000, ideal: 2500 },
      { name: 'Data Throughput', value: 570, minimum: 200, maximum: 800, ideal: 600 },
      { name: 'Backup Time (min)', value: 45, minimum: 30, maximum: 240, ideal: 40 }
    ],
    
    // Implementation phases
    implementationPhases: [
      { name: 'Assessment', duration: '4 weeks', completion: 100, nextSteps: 'Complete system inventory finalized' },
      { name: 'Planning', duration: '6 weeks', completion: 100, nextSteps: 'Migration strategy document approved' },
      { name: 'Development', duration: '12 weeks', completion: 85, nextSteps: 'Custom code migration in progress' },
      { name: 'Testing', duration: '8 weeks', completion: 40, nextSteps: 'Integration testing scheduled' },
      { name: 'Training', duration: '4 weeks', completion: 15, nextSteps: 'Admin training sessions planned' },
      { name: 'Go-Live', duration: '2 weeks', completion: 0, nextSteps: 'Pending successful testing' }
    ]
  };

  // Effect to simulate loading data
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Card base class
  const cardBaseClass = "backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 border border-green-500/15 group relative overflow-hidden";
  
  // Card hover class
  const cardHoverClass = "hover:shadow-[0_10px_40px_rgba(16,185,129,0.3)] hover:border-green-500/30 hover:scale-[1.01]";
  
  // Handle card click for zooming
  const handleCardClick = (cardId: string) => {
    setActiveCard(activeCard === cardId ? null : cardId);
  };
  
  // Open detail modal
  const openDetailModal = (detail: string) => {
    setSelectedDetail(detail);
    setShowDetailModal(true);
  };
  
  // COLORS for charts
  const COLORS = ['#10B981', '#047857', '#34D399', '#065F46', '#059669', '#6EE7B7', '#064E3B'];
  
  // Calculate the savings percentage
  const calculateSavingsPercentage = () => {
    const currentCost = parseInt(sapMigrationData.costWithoutS4HANA.replace(/[$,]/g, ''));
    const newCost = parseInt(sapMigrationData.costWithS4HANA.replace(/[$,]/g, ''));
    return Math.round(((currentCost - newCost) / currentCost) * 100);
  };

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
        ) : isCalculating ? (
          <div className={cardBaseClass}>
            <div className="card-body flex flex-col items-center justify-center py-16 relative z-10">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <MdOutlineCalculate className="text-green-500 text-3xl animate-pulse" />
                <div className="h-4 w-24 bg-gradient-to-r from-green-500 to-green-300 rounded-full relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent to-white opacity-30 animate-pulse"></div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Calculating Migration Data...
              </h3>
              <p className="text-gray-400 text-center max-w-md mb-8">
                Please wait while we analyze your SAP system and calculate potential S/4HANA migration benefits...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Personalized Contact Data Section */}
            <div className={`${cardBaseClass} p-6 mb-8 animate-glassFadeIn overflow-hidden relative bg-gradient-to-br from-[rgba(16,185,129,0.05)] to-[rgba(16,185,129,0.01)] border-green-500/20 hover:border-green-400/30 transition-all duration-500 shadow-[0_10px_50px_rgba(16,185,129,0.2)]`}>
              {/* Decorative elements */}
              <div className="absolute -top-36 -right-36 w-96 h-96 rounded-full bg-green-500/5 blur-[100px] pointer-events-none"></div>
              <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-green-400/5 blur-[80px] pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 relative z-10">
                <div className="flex items-center space-x-5">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/30 to-green-300/20 flex items-center justify-center border border-green-400/20 shadow-lg shadow-green-900/10">
                    <FaUserTie className="text-green-400 text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1 text-shadow-sm">{contactInfo.name}</h2>
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
                      setActiveMetric('system_metrics');
                      setShowInfoModal(true);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center hover:bg-green-500/20 transition-colors z-10"
                  >
                    <FaInfoCircle className="text-green-400 text-sm" />
                  </button>
                  
                  <h3 className="text-xl font-semibold text-white mb-5 flex items-center">
                    <FaChartLine className="text-green-400 mr-2" />
                    Key System Metrics
                  </h3>
                  
                  <div className="space-y-5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center">
                          <FaUsers className="text-green-400" />
                        </div>
                        <span className="text-gray-300">Users</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-white font-medium text-lg">{sapMetrics.users.toLocaleString()}</span>
                        <button 
                          onClick={() => {
                            setActiveMetric('users');
                            setShowInfoModal(true);
                          }}
                          className="ml-2 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center hover:bg-green-500/30 transition-colors"
                        >
                          <FaInfoCircle className="text-green-400 text-sm" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center">
                          <FaExchangeAltIcon className="text-green-400" />
                        </div>
                        <span className="text-gray-300">Transactions</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-white font-medium text-lg">{(sapMetrics.transactions / 1000000).toFixed(2)}M</span>
                        <button 
                          onClick={() => {
                            setActiveMetric('transactions');
                            setShowInfoModal(true);
                          }}
                          className="ml-2 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center hover:bg-green-500/30 transition-colors"
                        >
                          <FaInfoCircle className="text-green-400 text-sm" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center">
                          <MdOutlineSpeed className="text-green-400" />
                        </div>
                        <span className="text-gray-300">Throughput</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-white font-medium text-lg">{sapMetrics.throughput.toLocaleString()} TPS</span>
                        <button 
                          onClick={() => {
                            setActiveMetric('throughput');
                            setShowInfoModal(true);
                          }}
                          className="ml-2 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center hover:bg-green-500/30 transition-colors"
                        >
                          <FaInfoCircle className="text-green-400 text-sm" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center">
                          <FaPercentage className="text-green-400" />
                        </div>
                        <span className="text-gray-300">Efficiency</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-white font-medium text-lg">{sapMetrics.efficiency}%</span>
                        <button 
                          onClick={() => {
                            setActiveMetric('efficiency');
                            setShowInfoModal(true);
                          }}
                          className="ml-2 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center hover:bg-green-500/30 transition-colors"
                        >
                          <FaInfoCircle className="text-green-400 text-sm" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center">
                          <FaChartLine className="text-green-400" />
                        </div>
                        <span className="text-gray-300">Performance Score</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-white font-medium text-lg">{sapMetrics.performanceScore}%</span>
                        <button 
                          onClick={() => {
                            setActiveMetric('performanceScore');
                            setShowInfoModal(true);
                          }}
                          className="ml-2 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center hover:bg-green-500/30 transition-colors"
                        >
                          <FaInfoCircle className="text-green-400 text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Financial Metrics */}
                <div className="col-span-1 rounded-2xl p-6 backdrop-blur-md bg-gradient-to-br from-[rgba(16,185,129,0.08)] to-[rgba(16,185,129,0.02)] border border-green-500/20 shadow-lg shadow-black/20 transform transition-all duration-300 hover:shadow-green-900/20 hover:border-green-400/30 hover:scale-[1.02] relative group">
                  <button 
                    onClick={() => {
                      setActiveMetric('financial_metrics');
                      setShowInfoModal(true);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center hover:bg-green-500/20 transition-colors z-10"
                  >
                    <FaInfoCircle className="text-green-400 text-sm" />
                  </button>
                  
                  <h3 className="text-xl font-semibold text-white mb-5 flex items-center">
                    <FaMoneyBillWave className="text-green-400 mr-2" />
                    Financial Metrics
                  </h3>
                  
                  <div className="space-y-5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-green-700/20 flex items-center justify-center">
                          <FaMoneyBillWave className="text-green-300" />
                        </div>
                        <span className="text-gray-300">Current Cost</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-300 font-medium text-lg">${sapMetrics.currentCost.toLocaleString()}</span>
                        <button 
                          onClick={() => {
                            setActiveMetric('currentCost');
                            setShowInfoModal(true);
                          }}
                          className="ml-2 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center hover:bg-green-500/30 transition-colors"
                        >
                          <FaInfoCircle className="text-green-400 text-sm" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                          <FaMoneyBillWave className="text-green-400" />
                        </div>
                        <span className="text-gray-300">Optimized Cost</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-400 font-medium text-lg">${sapMetrics.optimizedCost.toLocaleString()}</span>
                        <button 
                          onClick={() => {
                            setActiveMetric('optimizedCost');
                            setShowInfoModal(true);
                          }}
                          className="ml-2 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center hover:bg-green-500/30 transition-colors"
                        >
                          <FaInfoCircle className="text-green-400 text-sm" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-green-400/20 flex items-center justify-center">
                          <MdOutlineSavings className="text-green-400" />
                        </div>
                        <span className="text-gray-300">Annual Savings</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-400 font-medium text-lg">${sapMetrics.savingsPerYear.toLocaleString()}</span>
                        <button 
                          onClick={() => {
                            setActiveMetric('savingsPerYear');
                            setShowInfoModal(true);
                          }}
                          className="ml-2 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center hover:bg-green-500/30 transition-colors"
                        >
                          <FaInfoCircle className="text-green-400 text-sm" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                          <FaMoneyBill className="text-green-400" />
                        </div>
                        <span className="text-gray-300">Licence Rate</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-white font-medium text-lg">${sapMetrics.licenceRate.toFixed(3)}/trx</span>
                        <button 
                          onClick={() => {
                            setActiveMetric('licenceRate');
                            setShowInfoModal(true);
                          }}
                          className="ml-2 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center hover:bg-green-500/30 transition-colors"
                        >
                          <FaInfoCircle className="text-green-400 text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* ROI Visualization */}
                <div className="col-span-1 rounded-2xl p-6 backdrop-blur-md bg-gradient-to-br from-[rgba(16,185,129,0.08)] to-[rgba(16,185,129,0.02)] border border-green-500/20 shadow-lg shadow-black/20 transform transition-all duration-300 hover:shadow-green-900/20 hover:border-green-400/30 hover:scale-[1.02] flex flex-col relative group">
                  <button 
                    onClick={() => {
                      setActiveMetric('roi_metrics');
                      setShowInfoModal(true);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center hover:bg-green-500/20 transition-colors z-10"
                  >
                    <FaInfoCircle className="text-green-400 text-sm" />
                  </button>
                  
                  <h3 className="text-xl font-semibold text-white mb-5 flex items-center">
                    <FaCalculatorIcon className="text-green-400 mr-2" />
                    Return on Investment
                  </h3>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex-1 flex items-center justify-center relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full bg-green-500/5 blur-[30px]"></div>
                      </div>
                      <div className="relative w-48 h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'ROI', value: Math.min(sapMetrics.roi, 500) },
                                { name: 'Base', value: 100 }
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={65}
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
                          <p className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">{sapMetrics.roi}%</p>
                          <p className="text-sm text-gray-400">ROI</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                          <FaClock className="text-green-400" />
                        </div>
                        <span className="text-gray-300">Payback Period</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-white font-medium text-lg">{sapMetrics.paybackMonths} mo</span>
                        <button 
                          onClick={() => {
                            setActiveMetric('paybackMonths');
                            setShowInfoModal(true);
                          }}
                          className="ml-2 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center hover:bg-green-500/30 transition-colors"
                        >
                          <FaInfoCircle className="text-green-400 text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Cost Comparison Chart */}
              <div className="h-72 rounded-2xl p-6 backdrop-blur-md bg-gradient-to-br from-[rgba(16,185,129,0.03)] to-[rgba(16,185,129,0.08)] border border-green-500/20 shadow-lg shadow-black/20 transform transition-all duration-300 hover:shadow-green-900/20 hover:border-green-400/30 relative group">
                <button 
                  onClick={() => {
                    setActiveMetric('cost_comparison');
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
            
            {/* Information Modal */}
            {showInfoModal && activeMetric && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
                <div className="relative max-w-3xl w-full bg-gradient-to-br from-[#1A1A1A]/95 via-[#1A1A1A]/90 to-[#1A1A1A]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-green-500/20 p-6 max-h-[90vh] overflow-y-auto animate-slideUp">
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
                        {activeMetric === 'transactions' && <FaExchangeAltIcon className="text-green-400 text-xl" />}
                        {activeMetric === 'throughput' && <MdOutlineSpeed className="text-green-400 text-xl" />}
                        {activeMetric === 'efficiency' && <FaPercentage className="text-green-400 text-xl" />}
                        {activeMetric === 'currentCost' && <FaMoneyBillWave className="text-green-400 text-xl" />}
                        {activeMetric === 'optimizedCost' && <FaMoneyBillWave className="text-green-400 text-xl" />}
                        {activeMetric === 'savingsPerYear' && <MdOutlineSavings className="text-green-400 text-xl" />}
                        {activeMetric === 'licenceRate' && <FaMoneyBill className="text-green-400 text-xl" />}
                        {activeMetric === 'roi' && <FaCalculatorIcon className="text-green-400 text-xl" />}
                        {activeMetric === 'paybackMonths' && <FaClock className="text-green-400 text-xl" />}
                        {activeMetric === 'performanceScore' && <FaChartLine className="text-green-400 text-xl" />}
                        {activeMetric === 'system_metrics' && <FaServer className="text-green-400 text-xl" />}
                        {activeMetric === 'financial_metrics' && <FaMoneyBillWave className="text-green-400 text-xl" />}
                        {activeMetric === 'roi_metrics' && <FaCalculatorIcon className="text-green-400 text-xl" />}
                        {activeMetric === 'cost_comparison' && <FaChartBar className="text-green-400 text-xl" />}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-green-200">{metricTooltips[activeMetric].name}</h3>
                        <p className="text-green-300/70">{metricTooltips[activeMetric].description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6 space-y-5 relative z-10">
                    <div className="animate-fadeIn animation-delay-100">
                      <h4 className="text-green-400 font-medium mb-2 flex items-center">
                        <FaCalculatorIcon className="mr-2" />
                        Formula
                      </h4>
                      <div className="bg-black/30 rounded-lg p-4 border border-green-500/10 hover:border-green-500/20 transition-colors">
                        <p className="text-white font-mono">{metricTooltips[activeMetric].formula}</p>
                      </div>
                    </div>
                    
                    <div className="animate-fadeIn animation-delay-200">
                      <h4 className="text-green-400 font-medium mb-2 flex items-center">
                        <MdOutlineCalculate className="mr-2" />
                        Calculation Breakdown
                      </h4>
                      <div className="bg-black/30 rounded-lg p-4 border border-green-500/10 hover:border-green-500/20 transition-colors">
                        <p className="text-white">{metricTooltips[activeMetric].calculation}</p>
                      </div>
                    </div>
                    
                    <div className="animate-fadeIn animation-delay-300">
                      <h4 className="text-green-400 font-medium mb-2 flex items-center">
                        <MdInfo className="mr-2" />
                        Context & Example
                      </h4>
                      <div className="bg-black/30 rounded-lg p-4 border border-green-500/10 hover:border-green-500/20 transition-colors">
                        <p className="text-white">{metricTooltips[activeMetric].example}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-900/20 to-green-800/10 rounded-lg p-5 border border-green-500/20 mt-6 animate-fadeIn animation-delay-400">
                      <h4 className="text-white font-medium mb-3 flex items-center">
                        <FaInfoCircle className="text-green-400 mr-2" />
                        Current Value
                      </h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-green-500">
                            {activeMetric === 'users' && `${sapMetrics.users.toLocaleString()}`}
                            {activeMetric === 'transactions' && `${(sapMetrics.transactions / 1000000).toFixed(2)}M`}
                            {activeMetric === 'throughput' && `${sapMetrics.throughput.toLocaleString()}`}
                            {activeMetric === 'efficiency' && `${sapMetrics.efficiency}%`}
                            {activeMetric === 'currentCost' && `$${sapMetrics.currentCost.toLocaleString()}`}
                            {activeMetric === 'optimizedCost' && `$${sapMetrics.optimizedCost.toLocaleString()}`}
                            {activeMetric === 'savingsPerYear' && `$${sapMetrics.savingsPerYear.toLocaleString()}`}
                            {activeMetric === 'licenceRate' && `$${sapMetrics.licenceRate.toFixed(3)}`}
                            {activeMetric === 'roi' && `${sapMetrics.roi}%`}
                            {activeMetric === 'paybackMonths' && `${sapMetrics.paybackMonths}`}
                            {activeMetric === 'performanceScore' && `${sapMetrics.performanceScore}%`}
                            {(activeMetric === 'system_metrics' || activeMetric === 'financial_metrics' || 
                              activeMetric === 'roi_metrics' || activeMetric === 'cost_comparison') && 
                              `${contactInfo.name}'s Metrics`}
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            {activeMetric === 'users' && `Total Users`}
                            {activeMetric === 'transactions' && `Annual Transactions`}
                            {activeMetric === 'throughput' && `TPS (Transactions per Second)`}
                            {activeMetric === 'efficiency' && `Resource Efficiency`}
                            {activeMetric === 'currentCost' && `Annual Cost`}
                            {activeMetric === 'optimizedCost' && `Optimized Annual Cost`}
                            {activeMetric === 'savingsPerYear' && `Annual Savings`}
                            {activeMetric === 'licenceRate' && `Per Transaction`}
                            {activeMetric === 'roi' && `Return on Investment`}
                            {activeMetric === 'paybackMonths' && `Months`}
                            {activeMetric === 'performanceScore' && `System Score`}
                            {(activeMetric === 'system_metrics' || activeMetric === 'financial_metrics' || 
                              activeMetric === 'roi_metrics' || activeMetric === 'cost_comparison') && 
                              `Wood • ${contactInfo.location}`}
                          </p>
                        </div>
                        <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center">
                          {activeMetric === 'users' && <FaUsers className="text-green-400 text-2xl" />}
                          {activeMetric === 'transactions' && <FaExchangeAltIcon className="text-green-400 text-2xl" />}
                          {activeMetric === 'throughput' && <MdOutlineSpeed className="text-green-400 text-2xl" />}
                          {activeMetric === 'efficiency' && <FaPercentage className="text-green-400 text-2xl" />}
                          {activeMetric === 'currentCost' && <FaMoneyBillWave className="text-green-400 text-2xl" />}
                          {activeMetric === 'optimizedCost' && <FaMoneyBillWave className="text-green-400 text-2xl" />}
                          {activeMetric === 'savingsPerYear' && <MdOutlineSavings className="text-green-400 text-2xl" />}
                          {activeMetric === 'licenceRate' && <FaMoneyBill className="text-green-400 text-2xl" />}
                          {activeMetric === 'roi' && <FaCalculatorIcon className="text-green-400 text-2xl" />}
                          {activeMetric === 'paybackMonths' && <FaClock className="text-green-400 text-2xl" />}
                          {activeMetric === 'performanceScore' && <FaChartLine className="text-green-400 text-2xl" />}
                          {activeMetric === 'system_metrics' && <FaServer className="text-green-400 text-2xl" />}
                          {activeMetric === 'financial_metrics' && <FaMoneyBillWave className="text-green-400 text-2xl" />}
                          {activeMetric === 'roi_metrics' && <FaCalculatorIcon className="text-green-400 text-2xl" />}
                          {activeMetric === 'cost_comparison' && <FaChartBar className="text-green-400 text-2xl" />}
                        </div>
                      </div>
                    </div>
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
            
            {/* Header Section with Key Metrics */}
            <div className={cardBaseClass + " p-6 " + cardHoverClass}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">SAP S/4HANA Migration Analysis</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Analysis Completed</span>
                  <FaCheckCircle className="text-green-500" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Annual Cost Without S/4HANA</p>
                      <p className="text-xl text-red-500 font-bold">{sapMigrationData.costWithoutS4HANA}</p>
                    </div>
                    <FaMoneyBill className="text-red-400 text-2xl opacity-80" />
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Annual Cost With S/4HANA</p>
                      <p className="text-xl text-green-500 font-bold">{sapMigrationData.costWithS4HANA}</p>
                    </div>
                    <FaRegSave className="text-green-400 text-2xl opacity-80" />
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Annual Savings</p>
                      <p className="text-xl text-white font-bold">${parseInt(sapMigrationData.costWithoutS4HANA.replace(/[$,]/g, '')) - parseInt(sapMigrationData.costWithS4HANA.replace(/[$,]/g, ''))}</p>
                    </div>
                    <MdOutlineSavings className="text-accent-primary text-2xl opacity-80" />
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">ROI Period</p>
                      <p className="text-xl text-white font-bold">{sapMigrationData.roiPeriod}</p>
                    </div>
                    <FaClock className="text-blue-400 text-2xl opacity-80" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                {/* Savings percentage */}
                <div className="col-span-1">
                  <div className="flex flex-col items-center">
                    <h3 className="text-xl font-semibold text-white mb-4">Cost Reduction</h3>
                    <div className="relative w-40 h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Savings', value: calculateSavingsPercentage() },
                              { name: 'Remaining', value: 100 - calculateSavingsPercentage() }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={60}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            <Cell key="cell-0" fill="#10B981" />
                            <Cell key="cell-1" fill="#1F2937" />
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [`${value}%`, '']}
                            contentStyle={{ backgroundColor: 'rgba(26, 32, 44, 0.9)', borderRadius: '0.5rem', border: '1px solid rgba(72, 187, 120, 0.3)' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <p className="text-3xl font-bold text-green-500">{calculateSavingsPercentage()}%</p>
                        <p className="text-xs text-gray-400">Reduction</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Module Breakdown */}
                <div className="col-span-1">
                  <h3 className="text-xl font-semibold text-white mb-4">Module Usage</h3>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sapMigrationData.moduleUsageBreakdown}
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {sapMigrationData.moduleUsageBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value}%`, '']}
                          contentStyle={{ backgroundColor: 'rgba(26, 32, 44, 0.9)', borderRadius: '0.5rem', border: '1px solid rgba(72, 187, 120, 0.3)' }}
                        />
                        <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Implementation Timeline */}
                <div className="col-span-1">
                  <h3 className="text-xl font-semibold text-white mb-4">Implementation Progress</h3>
                  <div className="space-y-3">
                    {sapMigrationData.implementationPhases.slice(0, 4).map((phase, index) => (
                      <div key={index} className="relative">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">{phase.name}</span>
                          <span className="text-gray-400">{phase.completion}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-green-300 h-2.5 rounded-full" 
                            style={{ width: `${phase.completion}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
              <div 
                className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer mx-1 ${selectedTab === 'timeline' ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                onClick={() => setSelectedTab('timeline')}
              >
                Timeline
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="space-y-6">
              {selectedTab === 'overview' && (
                <>
                  {/* Overview Tab Content */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Key Benefits Card */}
                    <div className={`${cardBaseClass} p-6 ${cardHoverClass}`} onClick={() => handleCardClick('benefits')}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-white">Key Migration Benefits</h3>
                        <FaCheckCircle className="text-green-500 text-xl" />
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                            <FaRegSave className="text-green-500" />
                          </div>
                          <div>
                            <p className="font-medium text-white">Cost Reduction</p>
                            <p className="text-sm text-gray-400">Total operational cost reduced by {sapMigrationData.operationalCostReduction}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                            <MdOutlineSpeed className="text-green-500" />
                          </div>
                          <div>
                            <p className="font-medium text-white">Performance Improvement</p>
                            <p className="text-sm text-gray-400">Processing speed improved by {sapMigrationData.processingSpeedImprovement}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                            <FaServer className="text-green-500" />
                          </div>
                          <div>
                            <p className="font-medium text-white">Infrastructure Optimization</p>
                            <p className="text-sm text-gray-400">Server footprint reduced by {sapMigrationData.serverReduction}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                            <FaUsers className="text-green-500" />
                          </div>
                          <div>
                            <p className="font-medium text-white">User Productivity</p>
                            <p className="text-sm text-gray-400">User productivity increased by {sapMigrationData.userProductivityGain}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* System Metrics Card */}
                    <div className={`${cardBaseClass} p-6 ${cardHoverClass}`} onClick={() => handleCardClick('metrics')}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-white">System Performance Metrics</h3>
                        <MdOutlineAnalytics className="text-accent-primary text-xl" />
                      </div>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={sapMigrationData.systemMetrics}>
                            <PolarGrid stroke="#374151" />
                            <PolarAngleAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                            <PolarRadiusAxis angle={90} domain={[0, 'auto']} tick={{ fill: '#9CA3AF' }} />
                            <Radar name="Current Value" dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                            <Radar name="Ideal Value" dataKey="ideal" stroke="#047857" fill="#047857" fillOpacity={0.4} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: 'rgba(26, 32, 44, 0.9)', borderRadius: '0.5rem', border: '1px solid rgba(72, 187, 120, 0.3)' }}
                            />
                            <Legend />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    {/* Cost Breakdown Card */}
                    <div className={`${cardBaseClass} p-6 ${cardHoverClass}`} onClick={() => handleCardClick('costAnalysis')}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-white">Cost Breakdown</h3>
                        <FaMoneyBill className="text-green-500 text-xl" />
                      </div>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={sapMigrationData.costBreakdown.slice(0, 4)}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#374151" />
                            <XAxis type="number" tick={{ fill: '#9CA3AF' }} />
                            <YAxis dataKey="name" type="category" tick={{ fill: '#9CA3AF' }} width={100} />
                            <Tooltip
                              formatter={(value) => [`$${value.toLocaleString()}`, '']}
                              contentStyle={{ backgroundColor: 'rgba(26, 32, 44, 0.9)', borderRadius: '0.5rem', border: '1px solid rgba(72, 187, 120, 0.3)' }}
                            />
                            <Legend />
                            <Bar dataKey="currentCost" name="Current Cost" fill="#065F46" />
                            <Bar dataKey="cloudCost" name="Cloud Cost" fill="#10B981" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    {/* Savings Timeline Card */}
                    <div className={`${cardBaseClass} p-6 ${cardHoverClass}`} onClick={() => handleCardClick('timeline')}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-white">Savings & Investment Timeline</h3>
                        <MdOutlineTimeline className="text-green-500 text-xl" />
                      </div>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={sapMigrationData.savingsTimeline}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                              </linearGradient>
                              <linearGradient id="colorMigration" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#065F46" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#065F46" stopOpacity={0.1} />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="name" tick={{ fill: '#9CA3AF' }} />
                            <YAxis tick={{ fill: '#9CA3AF' }} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                            <Tooltip
                              formatter={(value) => [`$${value.toLocaleString()}`, '']}
                              contentStyle={{ backgroundColor: 'rgba(26, 32, 44, 0.9)', borderRadius: '0.5rem', border: '1px solid rgba(72, 187, 120, 0.3)' }}
                            />
                            <Area type="monotone" dataKey="savings" stroke="#10B981" fillOpacity={1} fill="url(#colorSavings)" />
                            <Area type="monotone" dataKey="migration" stroke="#065F46" fillOpacity={1} fill="url(#colorMigration)" />
                            <Legend />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {selectedTab === 'costs' && (
                <>
                  {/* Cost Analysis Tab Content */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Detailed Cost Comparison Card */}
                    <div className={`${cardBaseClass} p-6 ${cardHoverClass}`}>
                      <h3 className="text-xl font-semibold text-white mb-4">Detailed Cost Comparison</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-3 bg-white/5 p-4 rounded-lg">
                            <p className="text-white font-medium">Implementation Costs</p>
                            <div className="flex justify-between mt-2">
                              <span className="text-gray-400">One-time</span>
                              <span className="text-white">{sapMigrationData.implementationCost}</span>
                            </div>
                          </div>
                          
                          <div className="col-span-3 md:col-span-1 bg-white/5 p-4 rounded-lg">
                            <p className="text-gray-300 text-sm">Training</p>
                            <p className="text-white mt-1">{sapMigrationData.trainingCost}</p>
                          </div>
                          
                          <div className="col-span-3 md:col-span-1 bg-white/5 p-4 rounded-lg">
                            <p className="text-gray-300 text-sm">Consulting</p>
                            <p className="text-white mt-1">{sapMigrationData.consultingFees}</p>
                          </div>
                          
                          <div className="col-span-3 md:col-span-1 bg-white/5 p-4 rounded-lg">
                            <p className="text-gray-300 text-sm">Hardware</p>
                            <p className="text-white mt-1">{sapMigrationData.hardwareUpgrades}</p>
                          </div>
                          
                          <div className="col-span-3 bg-white/5 p-4 rounded-lg">
                            <p className="text-white font-medium">Annual Costs</p>
                            <div className="flex justify-between mt-2">
                              <span className="text-gray-400">Current</span>
                              <span className="text-red-500">{sapMigrationData.costWithoutS4HANA}</span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-gray-400">With S/4HANA</span>
                              <span className="text-green-500">{sapMigrationData.costWithS4HANA}</span>
                            </div>
                          </div>
                          
                          <div className="col-span-3 bg-white/5 p-4 rounded-lg">
                            <p className="text-white font-medium">Five-Year TCO</p>
                            <div className="flex justify-between mt-2">
                              <span className="text-gray-400">Total Cost of Ownership</span>
                              <span className="text-white">{sapMigrationData.fiveYearTCO}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Cost Reduction Visualization */}
                    <div className={`${cardBaseClass} p-6 ${cardHoverClass}`}>
                      <h3 className="text-xl font-semibold text-white mb-4">Departmental Cost Reduction</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={sapMigrationData.costBreakdown}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" tick={{ fill: '#9CA3AF' }} />
                            <YAxis tick={{ fill: '#9CA3AF' }} />
                            <Tooltip
                              formatter={(value) => [`$${value.toLocaleString()}`, '']}
                              contentStyle={{ backgroundColor: 'rgba(26, 32, 44, 0.9)', borderRadius: '0.5rem', border: '1px solid rgba(72, 187, 120, 0.3)' }}
                            />
                            <Legend />
                            <Bar dataKey="currentCost" name="Current Cost" fill="#F87171" />
                            <Bar dataKey="cloudCost" name="Cloud Cost" fill="#10B981" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Bottom Call to Action */}
            <div className="flex justify-center mt-8">
              <button 
                onClick={() => navigate('/migration-insights')}
                className="bg-gradient-to-br from-green-500 via-green-600 to-green-600 text-white py-4 px-8 rounded-xl font-medium flex items-center space-x-2 transform transition hover:scale-105"
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