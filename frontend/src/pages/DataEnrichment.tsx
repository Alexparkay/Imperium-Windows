import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineCalculate, MdOutlineAnalytics, MdOutlineShowChart, MdArrowForward, MdInfoOutline, MdClose, MdZoomOutMap } from 'react-icons/md';
import { FaBuilding, FaChartLine, FaCalculator, FaChartBar, FaClock, FaMoneyBill, FaServer, FaTools, FaPercentage, FaDatabase, FaDesktop, FaUsers, FaNetworkWired, FaFileAlt, FaBolt, FaRegLightbulb } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, XAxis, YAxis, CartesianGrid, ReferenceLine, Area, AreaChart } from 'recharts';

// Dashboard-Engine communication interfaces
interface DashboardMessage {
  type: 'COMMAND' | 'STATE_REQUEST';
  payload: string;
}

interface EngineMessage {
  type: 'STATE_UPDATE' | 'ENGINE_READY' | 'INTERACTION';
  payload: any;
}

const DataEnrichment = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false); // Set to false to show the main content
  const [activeInfoModal, setActiveInfoModal] = useState<string | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [selectedPieSection, setSelectedPieSection] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [useEmbedHelper, setUseEmbedHelper] = useState(false);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const SOLAR_WINDOW_URL = "about:blank"; // Placeholder URL
  
  // Simplified data structure
  const sapMigrationData = {
    totalAnnualCost: '$4,287,650',
    averageMonthlySpend: '$357,304',
    licenseCount: '1,250 users',
    totalMaintenanceCost: '$965,000',
    monthlyMaintenanceAvg: '$80,417',
    costPerUser: '$3,430/user',
    costWithS4HANA: '$3,215,738',
    costWithoutS4HANA: '$4,287,650',
    monthlyDowntime: '8.3 hours',
    roiPeriod: '2.1 years',
    breakEvenPoint: '25.2 months',
    s4hanaPerformance: '72.4%',
    totalAnnualUsage: '250,000 kWh',
    averageMonthlyUsage: '20,833 kWh',
    solarEfficiency: '92.8%',
    peakDemand: '350 kW',
    moduleUsageBreakdown: {
      financials: 32,
      materials: 24,
      sales: 18,
      production: 14,
      other: 12
    },
    calculations: {
      annualTCO: {
        title: 'Annual Total Cost of Ownership',
        steps: [
          'License Costs: 1,250 users × avg. $1,200/user = $1,500,000',
          'System Maintenance: $965,000 annually (based on current contracts)',
          'Infrastructure Costs: $785,000 annually (server, storage, networking)',
          'Support Personnel: 15 FTEs × $85,500 avg. salary = $1,282,500',
          'Business Downtime Costs: 8.3 hours/month × $5,000/hour × 12 months = $498,000',
          'Integration Costs: $142,150 (third-party systems, APIs, middleware)',
          'Total Annual TCO: $4,287,650'
        ],
        methodology: 'TCO calculations based on current licensing agreements, maintenance contracts, IT infrastructure costs, and organizational data. Downtime costs calculated from historical system outages and business impact assessments.'
      },
      costAnalysis: {
        title: 'S/4HANA Cost Benefit Analysis',
        steps: [
          'Initial Migration Investment: $2,150,000 (implementation, consulting, training)',
          'New Infrastructure Costs: $625,000 (HANA-optimized servers, storage)',
          'Reduced Annual Licensing: $1,350,000 (10% reduction due to simplified licensing model)',
          'Reduced Maintenance: $680,000 annually (29.5% reduction from legacy system)',
          'Reduced Infrastructure Costs: $390,000 (50.3% reduction due to database compression)',
          'Reduced Support Personnel: 11 FTEs × $85,500 = $940,500 (26.7% reduction)',
          'Reduced Downtime Costs: 2.1 hours/month × $5,000/hour × 12 months = $126,000',
          'Total S/4HANA Annual TCO: $3,215,738'
        ],
        methodology: 'Cost projections based on SAP pricing models, industry benchmarks for similar migrations, and reference customer data. Infrastructure savings account for HANA\'s column-based storage and compression technology.'
      },
      businessMetrics: {
        title: 'Business Process Improvement Metrics',
        steps: [
          'Financial Close: 8.2 days → 3.1 days (62.2% reduction)',
          'Order-to-Cash: 12.5 hours → 4.2 hours (66.4% reduction)',
          'Procure-to-Pay: 9.3 days → 4.7 days (49.5% reduction)',
          'Inventory Management: Real-time vs. 24-hour batch updates',
          'Business Decision Latency: 72 hours → 8 hours (88.9% reduction)'
        ],
        methodology: 'Process metrics derived from current ECC performance data, industry benchmarks, and typical improvements seen in S/4HANA implementations. Latency measurements taken from end-to-end process timing across business scenarios.'
      },
      performanceMetrics: {
        title: 'Technical Performance Metrics',
        steps: [
          'Database Size: 12.8TB → 4.3TB (66.4% reduction due to HANA compression)',
          'Average Report Runtime: 128 seconds → 12 seconds (90.6% improvement)',
          'Batch Job Duration: Average 40% reduction across all processing',
          'System Availability: 99.1% → 99.9% (improved resilience)',
          'Integration Response Time: 820ms → 105ms (87.2% improvement)'
        ],
        methodology: 'Performance metrics based on technical benchmarks, SAP reference architectures, and proof-of-concept testing. Compression rates vary by data type and usage patterns.'
      }
    }
  };

  // Add ROI and cost data for graph
  const roiData = [
    { month: 0, withS4HANA: 2150000, withoutS4HANA: 0 }, // Initial investment
    { month: 6, withS4HANA: 2150000 + 6 * 267978, withoutS4HANA: 6 * 357304 },
    { month: 12, withS4HANA: 2150000 + 12 * 267978, withoutS4HANA: 12 * 357304 },
    { month: 18, withS4HANA: 2150000 + 18 * 267978, withoutS4HANA: 18 * 357304 },
    { month: 24, withS4HANA: 2150000 + 24 * 267978, withoutS4HANA: 24 * 357304 },
    { month: 25, withS4HANA: 2150000 + 25 * 267978, withoutS4HANA: 25 * 357304 }, // Crossing point
    { month: 30, withS4HANA: 2150000 + 30 * 267978, withoutS4HANA: 30 * 357304 },
    { month: 36, withS4HANA: 2150000 + 36 * 267978, withoutS4HANA: 36 * 357304 },
    { month: 42, withS4HANA: 2150000 + 42 * 267978, withoutS4HANA: 42 * 357304 },
    { month: 48, withS4HANA: 2150000 + 48 * 267978, withoutS4HANA: 48 * 357304 },
    { month: 54, withS4HANA: 2150000 + 54 * 267978, withoutS4HANA: 54 * 357304 },
    { month: 60, withS4HANA: 2150000 + 60 * 267978, withoutS4HANA: 60 * 357304 }
  ];

  // Format module usage data for pie chart with enhanced colors and descriptions
  const moduleUsagePieData = [
    { 
      id: 'financials',
      name: 'Financials', 
      value: sapMigrationData.moduleUsageBreakdown.financials, 
      color: '#10B981', 
      gradientStart: '#10B981',
      gradientEnd: '#34D399',
      icon: <FaMoneyBill />,
      description: 'Financial modules including General Ledger, Accounts Payable/Receivable, and Financial Controlling represent the largest usage area.',
      calculation: '120 financial processes × 212 daily transactions × 22 business days = 560,640 monthly transactions',
      breakdown: [
        { name: 'General Ledger', percentage: '42%', value: '235,469 transactions' },
        { name: 'Accounts Payable', percentage: '28%', value: '156,979 transactions' },
        { name: 'Accounts Receivable', percentage: '22%', value: '123,341 transactions' },
        { name: 'Asset Management', percentage: '8%', value: '44,851 transactions' }
      ],
      benefits: [
        'Universal Journal in S/4HANA reduces reconciliation time by 72%',
        'Real-time financial reporting eliminates batch processing delays',
        'Automated period-end closing reduces time from 8.2 days to 3.1 days'
      ]
    },
    { 
      id: 'materials',
      name: 'Materials', 
      value: sapMigrationData.moduleUsageBreakdown.materials, 
      color: '#3B82F6', 
      gradientStart: '#3B82F6',
      gradientEnd: '#60A5FA',
      icon: <FaServer />,
      description: 'Materials Management including Inventory, Purchasing, and Warehouse Management processes.',
      calculation: '430 inventory items × 85 daily transactions × 22 business days = 805,100 monthly transactions',
      breakdown: [
        { name: 'Inventory', percentage: '45%', value: '362,295 transactions' },
        { name: 'Purchasing', percentage: '35%', value: '281,785 transactions' },
        { name: 'Warehouse Mgmt', percentage: '20%', value: '161,020 transactions' }
      ],
      benefits: [
        'S/4HANA\'s MRP Live reduces planning runs from hours to minutes',
        'Advanced Available-to-Promise provides real-time inventory visibility',
        'Embedded analytics reduces inventory carrying costs by 18%'
      ]
    },
    { 
      id: 'sales',
      name: 'Sales', 
      value: sapMigrationData.moduleUsageBreakdown.sales, 
      color: '#8B5CF6', 
      gradientStart: '#8B5CF6',
      gradientEnd: '#A78BFA',
      icon: <FaChartLine />,
      description: 'Sales and Distribution processes including Order Management, Pricing, and Delivery.',
      calculation: '310 sales orders × 65 daily transactions × 22 business days = 443,300 monthly transactions',
      breakdown: [
        { name: 'Order Management', percentage: '52%', value: '230,516 transactions' },
        { name: 'Delivery Processing', percentage: '28%', value: '124,124 transactions' },
        { name: 'Billing', percentage: '20%', value: '88,660 transactions' }
      ],
      benefits: [
        'Order fulfillment time reduced by 65% with integrated processes',
        'Real-time ATP checks improve delivery reliability by 28%',
        'Advanced pricing simulations increase profit margins by 5.2%'
      ]
    },
    { 
      id: 'production',
      name: 'Production', 
      value: sapMigrationData.moduleUsageBreakdown.production, 
      color: '#EC4899', 
      gradientStart: '#EC4899',
      gradientEnd: '#F472B6',
      icon: <FaTools />,
      description: 'Production Planning and Execution processes including MRP, Capacity Planning, and Shop Floor Control.',
      calculation: '180 production orders × 42 daily transactions × 22 business days = 166,320 monthly transactions',
      breakdown: [
        { name: 'Production Planning', percentage: '45%', value: '74,844 transactions' },
        { name: 'Execution', percentage: '40%', value: '66,528 transactions' },
        { name: 'Quality Management', percentage: '15%', value: '24,948 transactions' }
      ],
      benefits: [
        'Advanced planning algorithms reduce WIP inventory by 22%',
        'Integrated quality management reduces defect rates by 35%',
        'Predictive maintenance features reduce unplanned downtime by 47%'
      ]
    },
    { 
      id: 'other',
      name: 'Other', 
      value: sapMigrationData.moduleUsageBreakdown.other, 
      color: '#F59E0B', 
      gradientStart: '#F59E0B',
      gradientEnd: '#FBBF24',
      icon: <FaPercentage />,
      description: 'Other modules including Human Resources, Plant Maintenance, Quality Management, and custom applications.',
      calculation: 'Various processes across 12 additional modules = 254,640 monthly transactions',
      breakdown: [
        { name: 'Human Resources', percentage: '35%', value: '89,124 transactions' },
        { name: 'Plant Maintenance', percentage: '25%', value: '63,660 transactions' },
        { name: 'Custom Modules', percentage: '40%', value: '101,856 transactions' }
      ],
      benefits: [
        'Employee self-service features reduce HR processing time by 42%',
        'Predictive maintenance reduces unplanned downtime by 35%',
        'Simplified architecture reduces custom code maintenance by 60%'
      ]
    }
  ];

  // Extended ROI data to show 25 years with extended gains - moved before it's used
  const extendedRoiData = [
    { year: 0, withS4HANA: 0, withoutS4HANA: 0, savings: 0, totalInvestment: 2150000 }, // Initial investment at 0
    { year: 1, withS4HANA: 2150000 + 6 * 267978, withoutS4HANA: 6 * 357304, savings: (6 * 357304) - (6 * 267978 + 2150000) + 2150000, totalInvestment: 2150000 },
    { year: 2, withS4HANA: 2150000 + 12 * 267978, withoutS4HANA: 12 * 357304, savings: (12 * 357304) - (12 * 267978 + 2150000) + 2150000, totalInvestment: 2150000 },
    { year: 3, withS4HANA: 2150000 + 18 * 267978, withoutS4HANA: 18 * 357304, savings: (18 * 357304) - (18 * 267978 + 2150000) + 2150000, totalInvestment: 2150000 },
    { year: 4, withS4HANA: 2150000 + 24 * 267978, withoutS4HANA: 24 * 357304, savings: (24 * 357304) - (24 * 267978 + 2150000) + 2150000, totalInvestment: 2150000 },
    { year: 5, withS4HANA: 2150000 + 25 * 267978, withoutS4HANA: 25 * 357304, savings: (25 * 357304) - (25 * 267978 + 2150000) + 2150000, totalInvestment: 2150000 },
    { year: 6, withS4HANA: 2150000 + 30 * 267978, withoutS4HANA: 30 * 357304, savings: (30 * 357304) - (30 * 267978 + 2150000) + 2150000, totalInvestment: 2150000 },
    { year: 7, withS4HANA: 2150000 + 36 * 267978, withoutS4HANA: 36 * 357304, savings: (36 * 357304) - (36 * 267978 + 2150000) + 2150000, totalInvestment: 2150000 },
    { year: 7.2, withS4HANA: 2150000 + 25 * 267978, withoutS4HANA: 25 * 357304, savings: (25 * 357304) - (25 * 267978 + 2150000) + 2150000, totalInvestment: 2150000 }, // Break-even point
    { year: 8, withS4HANA: 2150000 + 42 * 267978, withoutS4HANA: 42 * 357304, savings: (42 * 357304) - (42 * 267978 + 2150000) + 2150000, totalInvestment: 2150000 },
    { year: 9, withS4HANA: 2150000 + 48 * 267978, withoutS4HANA: 48 * 357304, savings: (48 * 357304) - (48 * 267978 + 2150000) + 2150000, totalInvestment: 2150000 },
    { year: 10, withS4HANA: 2150000 + 54 * 267978, withoutS4HANA: 54 * 357304, savings: (54 * 357304) - (54 * 267978 + 2150000) + 2150000, totalInvestment: 2150000 },
    { year: 12, withS4HANA: 2150000 + 60 * 267978, withoutS4HANA: 60 * 357304, savings: (60 * 357304) - (60 * 267978 + 2150000) + 2150000, totalInvestment: 2150000 },
    { year: 15, withS4HANA: 2150000 + 72 * 267978, withoutS4HANA: 72 * 357304, savings: (72 * 357304) - (72 * 267978 + 2150000) + 2150000, totalInvestment: 2150000 },
    { year: 18, withS4HANA: 2150000 + 84 * 267978, withoutS4HANA: 84 * 357304, savings: (84 * 357304) - (84 * 267978 + 2150000) + 2150000, totalInvestment: 2150000 },
    { year: 20, withS4HANA: 2150000 + 96 * 267978, withoutS4HANA: 96 * 357304, savings: (96 * 357304) - (96 * 267978 + 2150000) + 2150000, totalInvestment: 2150000 },
    { year: 22, withS4HANA: 2150000 + 108 * 267978, withoutS4HANA: 108 * 357304, savings: (108 * 357304) - (108 * 267978 + 2150000) + 2150000, totalInvestment: 2150000 },
    { year: 25, withS4HANA: 2150000 + 120 * 267978, withoutS4HANA: 120 * 357304, savings: (120 * 357304) - (120 * 267978 + 2150000) + 2150000, totalInvestment: 2150000 },
  ];

  // Calculate cumulative savings
  const calculateCumulativeSavings = (data: any[]) => {
    return data.map((entry, i) => {
      if (i === 0) return { ...entry, cumulativeSavings: entry.savings };
      return { 
        ...entry, 
        cumulativeSavings: data[i-1].cumulativeSavings + entry.savings - data[i-1].savings 
      };
    });
  };

  const roiDataWithCumulative = calculateCumulativeSavings(extendedRoiData);

  // Detailed section data for each category
  const getPieSectionDetails = (sectionId: string) => {
    return moduleUsagePieData.find(item => item.id === sectionId);
  };

  // Custom pie chart renderer with gradients and 3D effect
  const renderCustomizedPie = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = 25 + innerRadius + (outerRadius - innerRadius);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    const item = moduleUsagePieData[index];
    
    return (
      <g>
        <text 
          x={x} 
          y={y} 
          textAnchor={x > cx ? 'start' : 'end'} 
          dominantBaseline="central"
          className="font-semibold"
          fill="#fff"
        >
          {`${name} (${(percent * 100).toFixed(0)}%)`}
        </text>
      </g>
    );
  };

  // Custom tooltip for enhanced pie chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900/90 backdrop-blur-md p-4 rounded-lg shadow-lg border border-gray-700/50 max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${data.gradientStart}, ${data.gradientEnd})` }}>
              {data.icon}
            </div>
            <h4 className="text-lg font-semibold text-white">
              {data.name}: {data.value}%
            </h4>
          </div>
          <p className="text-sm text-gray-300 mb-2">{data.description}</p>
          <div className="text-xs text-gray-400">
            Click for detailed breakdown & calculations
          </div>
        </div>
      );
    }
    return null;
  };

  // Enhanced tooltip for ROI chart
  const CustomROITooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const savingsValue = data.cumulativeSavings;
      const isPositive = savingsValue > 0;
      
      return (
        <div className="bg-gray-900/90 backdrop-blur-md p-4 rounded-lg shadow-lg border border-gray-700/50">
          <h4 className="text-lg font-semibold text-white mb-2">Year {label}</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <span className="text-gray-300">Without S/4HANA:</span>
              <span className="font-semibold text-white">${data.withoutS4HANA.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              <span className="text-gray-300">With S/4HANA:</span>
              <span className="font-semibold text-white">${(data.withS4HANA + data.totalInvestment).toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-gray-700">
              <span className="text-gray-300">Cumulative Savings:</span>
              <span className={`font-semibold text-lg ml-2 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? '+' : ''}{data.cumulativeSavings.toLocaleString()} $
              </span>
            </div>
            {data.year >= 7.2 && (
              <div className="text-sm text-green-400 font-medium pt-1">
                {data.year === 7.2 ? 'Break-even point!' : 'Generating profit!'}
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Handle section click in pie chart to show details
  const handlePieSectionClick = (data: any, index: number) => {
    setSelectedPieSection(data.id);
    setShowDetailsModal(true);
  };

  // Modal for showing detailed breakdown of each module section
  const EnergyUsageDetailModal = ({ sectionId, onClose }: { sectionId: string | null, onClose: () => void }) => {
    if (!sectionId) return null;
    
    const sectionData = getPieSectionDetails(sectionId);
    
    if (!sectionData) return null;
    
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gray-900/90 backdrop-blur-md rounded-xl w-full max-w-3xl mx-4 overflow-hidden shadow-2xl border border-gray-700/50">
          <div className="p-6 border-b border-gray-700 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" 
                style={{ background: `linear-gradient(135deg, ${sectionData.gradientStart}, ${sectionData.gradientEnd})` }}>
                {sectionData.icon}
              </div>
              <h3 className="text-2xl font-bold text-white">
                {sectionData.name} Module Usage
              </h3>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <MdClose size={24} />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <MdOutlineAnalytics className="text-green-500" />
                Overview
              </h4>
              <p className="text-gray-300">{sectionData.description}</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <FaCalculator className="text-green-500" />
                Calculation
              </h4>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                <p className="text-gray-300 font-mono">{sectionData.calculation}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <FaChartBar className="text-green-500" />
                Detailed Breakdown
              </h4>
              <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden">
                <div className="grid grid-cols-3 text-sm font-medium text-gray-400 border-b border-gray-700 bg-gray-800/80">
                  <div className="p-3">Category</div>
                  <div className="p-3">Percentage</div>
                  <div className="p-3">Annual Usage</div>
                </div>
                {sectionData.breakdown.map((item, index) => (
                  <div key={index} className="grid grid-cols-3 text-sm border-b border-gray-700/50 last:border-0">
                    <div className="p-3 text-white">{item.name}</div>
                    <div className="p-3 text-green-500">{item.percentage}</div>
                    <div className="p-3 text-white">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <FaRegLightbulb className="text-green-500" />
                Efficiency Benefits
              </h4>
              <ul className="space-y-2">
                {sectionData.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-300">
                    <div className="text-green-500 mt-1">•</div>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="bg-gray-800/50 p-4 border-t border-gray-700 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleContinueToMigrationInsights = () => {
    navigate('/migration-insights');
  };

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        setIsCalculating(false);
      }, 1000);
    }, 1000);
  }, []);

  // Function to render the image of a facility's floor plan
  const renderFloorPlanImage = () => {
    return (
      <div className="w-full h-72 md:h-96 bg-white dark:bg-gray-800 rounded-xl overflow-hidden relative border-4 border-gray-200 dark:border-gray-700 shadow-md">
        <div id="solar-window-container" className="w-full h-full">
          {!useEmbedHelper && (
            <iframe
              ref={iframeRef}
              src={SOLAR_WINDOW_URL}
              className="w-full h-full border-0"
              title="Solar Window"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          )}
        </div>
      </div>
    );
  };

  // Information Modal Component
  const InfoModal = ({ title, steps, methodology, onClose }: { 
    title: string; 
    steps: string[]; 
    methodology: string;
    onClose: () => void;
  }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl w-full max-w-2xl mx-4 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <MdClose size={24} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h4 className="font-semibold text-lg mb-3 text-white">Calculation Steps</h4>
            <ol className="space-y-3">
              {steps.map((step, index) => (
                <li key={index} className="flex gap-3 text-gray-300">
                  <span className="font-bold text-green-500">{index + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3 text-white">Methodology</h4>
            <p className="text-gray-300">{methodology}</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Info Button Component
  const InfoButton = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
    >
      <MdInfoOutline size={20} className="text-gray-300" />
    </button>
  );

  // Define base classes for cards to match the Home page styling
  const cardBaseClass = "backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 border border-green-500/15 group relative overflow-hidden";

  // Information section
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {isCalculating ? (
          <div className={cardBaseClass}>
            {/* Decorative patterns */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" 
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, #000000 20px, #000000 22px)',
                  backgroundSize: '30px 30px'
                }}
              ></div>
            </div>
            
            {/* Gradient orbs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-green-500/10 to-transparent rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-tr-full"></div>
            
            <div className="card-body flex flex-col items-center justify-center py-16 relative z-10">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="loading loading-spinner loading-lg text-green-500 relative"></div>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent mb-4">
                Analyzing SAP Migration Data
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8">
                Our AI is analyzing your SAP ECC data to create detailed migration insights...
              </p>
              <div className="w-full max-w-md space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300">Analyzing system specifications</span>
                    <span className="text-green-500 font-medium">100%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300">Estimating migration costs</span>
                    <span className="text-green-500 font-medium">90%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full w-[90%] bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300">Calculating ROI metrics</span>
                    <span className="text-green-500 font-medium">75%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full w-[75%] bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300">Modeling business process improvements</span>
                    <span className="text-green-500 font-medium">45%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full w-[45%] bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* S/4HANA Migration Stats in annotation style layout */}
            <div className={cardBaseClass + " relative p-8"}>
              {/* Decorative patterns */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" 
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, #000000 20px, #000000 22px)',
                    backgroundSize: '30px 30px'
                  }}
                ></div>
              </div>
              
              {/* Gradient orbs */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-green-500/10 to-transparent rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-tr-full"></div>
              
              <div className="relative z-10 grid grid-cols-3 gap-6 items-center">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm relative">
                    <InfoButton onClick={() => setActiveInfoModal('annualTCO')} />
                    <h3 className="card-title text-lg flex items-center gap-2 mb-4">
                      <div className="bg-gradient-to-br from-green-500 to-green-600 w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                        <FaMoneyBill size={24} />
                    </div>
                      <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent text-xl">
                        Cost Analysis
                      </span>
                    </h3>
                    <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Annual TCO</p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                          {sapMigrationData.totalAnnualCost}
                      </p>
                    </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Average</p>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {sapMigrationData.averageMonthlySpend}
                        </p>
                  </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Per User Cost</p>
                        <p className="text-xl font-semibold text-green-500">
                          {sapMigrationData.costPerUser}
                        </p>
                </div>
              </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm relative">
                    <InfoButton onClick={() => setActiveInfoModal('costAnalysis')} />
                    <h3 className="card-title text-lg flex items-center gap-2 mb-4">
                      <div className="bg-gradient-to-br from-green-500 to-green-600 w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                        <FaCalculator size={24} />
                      </div>
                      <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent text-xl">
                        Migration ROI
                      </span>
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-baseline">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Without S/4HANA</p>
                          <p className="text-2xl font-bold text-red-500">{sapMigrationData.costWithoutS4HANA}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-400">With S/4HANA</p>
                          <p className="text-2xl font-bold text-green-500">{sapMigrationData.costWithS4HANA}</p>
                      </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">ROI Period</p>
                        <p className="text-xl font-semibold text-gray-900 dark:text-white">
                          {sapMigrationData.roiPeriod}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Break Even</p>
                        <p className="text-xl font-semibold text-gray-900 dark:text-white">
                          {sapMigrationData.breakEvenPoint}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center Image - Replace with an appropriate migration image */}
                <div className="relative">
                  <div className="w-full h-auto rounded-xl shadow-xl bg-gray-800/60 p-6 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 rounded-full bg-green-500/10 mb-4 flex items-center justify-center">
                      <FaServer className="text-green-500 text-4xl" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">S/4HANA Migration Analysis</h3>
                    <p className="text-gray-300 mb-4">Comprehensive analysis of your ECC to S/4HANA migration journey</p>
                    <div className="grid grid-cols-2 gap-3 w-full">
                      <div className="bg-gray-700/50 rounded p-3">
                        <p className="text-sm text-gray-400">Performance Gain</p>
                        <p className="text-lg font-bold text-green-400">{sapMigrationData.s4hanaPerformance}</p>
                      </div>
                      <div className="bg-gray-700/50 rounded p-3">
                        <p className="text-sm text-gray-400">Downtime</p>
                        <p className="text-lg font-bold text-white">{sapMigrationData.monthlyDowntime}</p>
                      </div>
                    </div>
                  </div>
                  {/* Enhanced connecting lines with gradients */}
                  <div className="absolute inset-0 pointer-events-none">
                    <svg className="w-full h-full" style={{ position: 'absolute', top: 0, left: 0 }}>
                      <defs>
                        <linearGradient id="lineGradient1" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="rgba(16,185,129,0.2)" />
                          <stop offset="100%" stopColor="rgba(59,130,246,0.2)" />
                        </linearGradient>
                      </defs>
                      <line x1="0" y1="50%" x2="100%" y2="50%" stroke="url(#lineGradient1)" strokeWidth="2" strokeDasharray="4" />
                      <line x1="50%" y1="0" x2="50%" y2="100%" stroke="url(#lineGradient1)" strokeWidth="2" strokeDasharray="4" />
                    </svg>
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm relative">
                    <InfoButton onClick={() => setActiveInfoModal('businessMetrics')} />
                    <h3 className="card-title text-lg flex items-center gap-2 mb-4">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                        <FaChartBar size={24} />
                      </div>
                      <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent text-xl">
                        Business Metrics
                      </span>
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">License Count</p>
                        <p className="text-xl font-semibold text-gray-900 dark:text-white">
                          {sapMigrationData.licenseCount}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Maintenance Cost</p>
                        <p className="text-xl font-semibold text-gray-900 dark:text-white">
                          {sapMigrationData.totalMaintenanceCost}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Average</p>
                        <p className="text-xl font-semibold text-blue-500">
                          {sapMigrationData.monthlyMaintenanceAvg}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm relative">
                    <InfoButton onClick={() => setActiveInfoModal('performanceMetrics')} />
                    <h3 className="card-title text-lg flex items-center gap-2 mb-4">
                      <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                        <FaClock size={24} />
                      </div>
                      <span className="bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent text-xl">
                        Technical Metrics
                      </span>
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Downtime</p>
                        <p className="text-2xl font-bold text-purple-500">{sapMigrationData.monthlyDowntime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">System Performance</p>
                        <p className="text-xl font-semibold text-gray-900 dark:text-white">
                          {sapMigrationData.s4hanaPerformance}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Reliability</p>
                        <p className="text-xl font-semibold text-green-500">99.89%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Render active info modal */}
            {activeInfoModal && (
              <InfoModal
                title={sapMigrationData.calculations[activeInfoModal as keyof typeof sapMigrationData.calculations].title}
                steps={sapMigrationData.calculations[activeInfoModal as keyof typeof sapMigrationData.calculations].steps}
                methodology={sapMigrationData.calculations[activeInfoModal as keyof typeof sapMigrationData.calculations].methodology}
                onClose={() => setActiveInfoModal(null)}
              />
            )}

            {/* Module Usage Breakdown and ROI Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Enhanced Pie Chart Section */}
              <div className={cardBaseClass + " p-6"}>
                {/* Decorative patterns */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" 
                    style={{
                      backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, #000000 20px, #000000 22px)',
                      backgroundSize: '30px 30px'
                    }}
                  ></div>
                </div>
                
                {/* Gradient orbs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-green-500/10 to-transparent rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-tr-full"></div>
              
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-lg text-white shadow-lg">
                      <MdOutlineAnalytics size={22} />
                    </div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                      Module Usage Breakdown
                    </h3>
                  </div>
                  
                  {/* Analysis explanation text */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl border border-green-500/20">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-green-500">
                        <MdInfoOutline size={20} />
                      </div>
                      <div>
                        <p className="text-white text-sm leading-relaxed">
                          This analysis represents your organization's module usage patterns in the current SAP ECC environment. 
                          Based on transaction volume data, this breakdown identifies high-usage areas that will require special attention during migration to S/4HANA. 
                          Understanding your usage patterns helps optimize the migration strategy and target resources appropriately.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-[400px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        {/* Define gradients for each sector */}
                        <defs>
                          {moduleUsagePieData.map((entry, index) => (
                            <linearGradient key={`gradient-${index}`} id={`pieGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={entry.gradientStart} stopOpacity={1} />
                              <stop offset="100%" stopColor={entry.gradientEnd} stopOpacity={0.8} />
                            </linearGradient>
                          ))}
                          <filter id="shadow" height="200%" width="200%" x="-50%" y="-50%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feFlood floodColor="#000" floodOpacity="0.3" result="shadowColor"/>
                            <feComposite in="shadowColor" in2="blur" operator="in" result="shadowBlur"/>
                            <feOffset in="shadowBlur" dx="1" dy="1" result="offsetBlur"/>
                            <feMerge>
                              <feMergeNode in="offsetBlur"/>
                              <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                          </filter>
                        </defs>
                        <Pie
                          data={moduleUsagePieData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={renderCustomizedPie}
                          outerRadius={130}
                          innerRadius={65}
                          fill="#8884d8"
                          dataKey="value"
                          paddingAngle={4}
                          filter="url(#shadow)"
                          onClick={handlePieSectionClick}
                          isAnimationActive={true}
                          animationDuration={1200}
                          animationBegin={300}
                          animationEasing="ease-out"
                        >
                          {moduleUsagePieData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={`url(#pieGradient-${index})`} 
                              stroke="rgba(255,255,255,0.2)"
                              strokeWidth={2}
                              style={{ cursor: 'pointer', filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.3))' }}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomPieTooltip />} />
                        <Legend
                          layout="vertical" 
                          verticalAlign="middle" 
                          align="right"
                          iconType="circle"
                          wrapperStyle={{
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                          onClick={(entry) => {
                            const sectionId = moduleUsagePieData.find(item => item.name === entry.value)?.id;
                            if (sectionId) {
                              setSelectedPieSection(sectionId);
                              setShowDetailsModal(true);
                            }
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="text-center mt-4">
                    <div className="inline-flex items-center gap-2 text-sm text-green-500 border border-green-500/30 px-3 py-1.5 rounded-full bg-green-500/10">
                      <MdZoomOutMap size={16} />
                      <p>Click on chart sections for detailed breakdown</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced ROI Chart Section */}
              <div className={cardBaseClass + " p-6"}>
                {/* Decorative patterns */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" 
                    style={{
                      backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, #000000 20px, #000000 22px)',
                      backgroundSize: '30px 30px'
                    }}
                  ></div>
                </div>
                
                {/* Gradient orbs */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-green-500/10 to-transparent rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-red-500/10 to-transparent rounded-tr-full"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-lg text-white shadow-lg">
                      <FaChartLine size={22} />
                    </div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                      25-Year S/4HANA ROI Projection
                    </h3>
                  </div>
                  
                  {/* ROI explanation text */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl border border-green-500/20">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-green-500">
                        <MdInfoOutline size={20} />
                      </div>
                      <div>
                        <p className="text-white text-sm leading-relaxed">
                          This financial projection illustrates the cumulative return on a $2,150,000 S/4HANA migration investment over 25 years. 
                          Based on current licensing costs and efficiency gains, the system achieves <span className="text-green-500 font-medium">break-even at 2.1 years</span>, 
                          with total savings of <span className="text-green-500 font-medium">${Math.round(roiDataWithCumulative[roiDataWithCumulative.length-1].cumulativeSavings).toLocaleString()}</span> over the system's lifetime. 
                          This analysis factors in all aspects of TCO including licensing, maintenance, infrastructure, and personnel costs.
                        </p>
                        <div className="grid grid-cols-3 gap-4 mt-3">
                          <div className="bg-gray-800/50 p-2 rounded-lg text-center">
                            <p className="text-xs text-gray-400">Break-even</p>
                            <p className="text-lg font-semibold text-white">2.1 years</p>
                          </div>
                          <div className="bg-gray-800/50 p-2 rounded-lg text-center">
                            <p className="text-xs text-gray-400">25-Year ROI</p>
                            <p className="text-lg font-semibold text-green-400">382%</p>
                          </div>
                          <div className="bg-gray-800/50 p-2 rounded-lg text-center">
                            <p className="text-xs text-gray-400">Monthly Savings</p>
                            <p className="text-lg font-semibold text-white">$89,326</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-[400px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={roiDataWithCumulative}
                        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorWithS4HANA" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.2}/>
                          </linearGradient>
                          <linearGradient id="colorWithoutS4HANA" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0.2}/>
                          </linearGradient>
                          <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.2}/>
                          </linearGradient>
                          <filter id="shadow" height="200%" width="200%" x="-50%" y="-50%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feFlood floodColor="#000" floodOpacity="0.2" result="color"/>
                            <feComposite in="color" in2="blur" operator="in" result="shadow"/>
                            <feMerge>
                              <feMergeNode in="shadow"/>
                              <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                          </filter>
                        </defs>
                        <CartesianGrid 
                          strokeDasharray="3 3" 
                          vertical={false} 
                          stroke="rgba(255,255,255,0.1)" 
                        />
                        <XAxis 
                          dataKey="year" 
                          stroke="#94a3b8"
                          tick={{ fill: '#94a3b8', fontSize: 12 }}
                          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                          tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                          allowDecimals={false}
                        />
                        <YAxis 
                          stroke="#94a3b8"
                          tick={{ fill: '#94a3b8', fontSize: 12 }}
                          tickFormatter={(value) => `$${Math.round(value/1000)}k`}
                          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                          tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                          domain={[0, 'auto']} // Force start at 0
                        />
                        <Tooltip content={<CustomROITooltip />} />
                        <Legend 
                          verticalAlign="top" 
                          align="right" 
                          wrapperStyle={{ paddingBottom: '20px', fontWeight: 600 }}
                        />
                        <ReferenceLine 
                          x={2.1} 
                          stroke="#10B981"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          label={{ 
                            value: 'Break-even: 2.1 years', 
                            position: 'top',
                            fill: '#10B981',
                            fontSize: 12,
                            fontWeight: 'bold'
                          }} 
                        />
                        
                        {/* Add annotation for initial investment */}
                        <ReferenceLine 
                          y={2150000} 
                          stroke="#FFFFFF"
                          strokeWidth={1}
                          strokeDasharray="3 3"
                          label={{ 
                            value: 'Initial Investment: $2,150,000', 
                            position: 'right',
                            fill: '#FFFFFF',
                            fontSize: 10,
                            opacity: 0.7
                          }} 
                        />
                        
                        <Area 
                          type="monotone" 
                          dataKey={(data) => data.withS4HANA + data.totalInvestment} // Add investment to costs
                          name="With S/4HANA" 
                          stroke="#10B981" 
                          fillOpacity={1}
                          fill="url(#colorWithS4HANA)" 
                          strokeWidth={3}
                          activeDot={{ r: 8, strokeWidth: 0, fill: '#10B981' }}
                          filter="url(#shadow)"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="withoutS4HANA" 
                          name="Without S/4HANA" 
                          stroke="#EF4444" 
                          fillOpacity={1}
                          fill="url(#colorWithoutS4HANA)" 
                          strokeWidth={3}
                          activeDot={{ r: 8, strokeWidth: 0, fill: '#EF4444' }}
                          filter="url(#shadow)"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="cumulativeSavings" 
                          name="Cumulative Savings" 
                          stroke="#10B981" 
                          fillOpacity={0.6}
                          fill="url(#colorSavings)" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          activeDot={{ r: 8, strokeWidth: 0, fill: '#10B981' }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm mt-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <FaMoneyBill className="text-green-500" size={16} />
                      <span>Total 25-year savings: </span>
                      <span className="font-semibold text-green-500">
                        ${Math.round(roiDataWithCumulative[roiDataWithCumulative.length-1].cumulativeSavings).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-gray-400">
                      S/4HANA Support: <span className="text-white">20+ years</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Render module usage breakdown detail modal when a section is clicked */}
            {showDetailsModal && selectedPieSection && (
              <EnergyUsageDetailModal
                sectionId={selectedPieSection}
                onClose={() => setShowDetailsModal(false)}
              />
            )}
            
            {/* Continue Button */}
            <div className="flex justify-center mt-8">
              <button 
                onClick={handleContinueToMigrationInsights}
                className="bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white py-4 px-8 rounded-xl font-medium transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 inline-flex items-center gap-3 group relative overflow-hidden"
              >
                {/* Decorative patterns */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" 
                    style={{
                      backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, #ffffff 20px, #ffffff 22px)',
                      backgroundSize: '30px 30px'
                    }}
                  ></div>
                </div>
                
                {/* Gradient orbs */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full"></div>
                
                <span className="relative z-10 text-lg">Continue to Migration Insights</span>
                <MdArrowForward className="relative z-10 text-2xl group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DataEnrichment; 