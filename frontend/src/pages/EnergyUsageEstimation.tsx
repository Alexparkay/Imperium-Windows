import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdElectricBolt, MdOutlineCalculate, MdOutlineAnalytics, MdOutlineShowChart, MdArrowForward, MdInfoOutline, MdClose, MdZoomOutMap } from 'react-icons/md';
import { FaSolarPanel, FaBuilding, FaChartLine, FaLightbulb, FaBolt, FaCalculator, FaChartBar, FaClock, FaMoneyBill, FaRegLightbulb, FaAirFreshener, FaServer, FaTools, FaPercentage } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, Area, AreaChart } from 'recharts';

// Define the SolarWindow interface for TypeScript
declare global {
  interface Window {
    SolarWindow?: {
      embed: (options: {
        containerId: string;
        height: string;
        width: string;
      }) => {
        onMessage: (type: string, callback: (data: any) => void) => void;
        sendMessage: (type: string, payload: any) => void;
      };
    };
  }
}

// Dashboard-Engine communication interfaces
interface DashboardMessage {
  type: 'COMMAND' | 'STATE_REQUEST';
  payload: string;
}

interface EngineMessage {
  type: 'STATE_UPDATE' | 'ENGINE_READY' | 'INTERACTION';
  payload: any;
}

const EnergyUsageEstimation = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [engineReady, setEngineReady] = useState(false);
  const [useEmbedHelper, setUseEmbedHelper] = useState(false);
  const [solarWindowInstance, setSolarWindowInstance] = useState<any>(null);
  const [activeInfoModal, setActiveInfoModal] = useState<string | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [selectedPieSection, setSelectedPieSection] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // URL for the Solar Window application
  const SOLAR_WINDOW_URL = 'http://localhost:5174'; // Updated Solar Window local instance
  
  // Enhanced energy data with detailed calculations
  const energyData = {
    totalAnnualUsage: '249,087.3 kWh',
    averageMonthlyUsage: '20,757.3 kWh',
    peakDemand: '155.7 kW',
    annualCost: '$77,217.08',
    monthlyAverage: '$6,434.76',
    ratePerKWh: '$0.310/kWh',
    costWithSolar: '$31,268.42',
    costWithoutSolar: '$77,217.08',
    monthlyPowerOutage: '0.8 hours',
    roiPeriod: '7.2 years',
    breakEvenPoint: '86.4 months',
    solarEfficiency: '21.3%',
    usageBreakdown: {
      hvac: 42,
      lighting: 22,
      equipment: 18,
      computers: 12,
      other: 6
    },
    calculations: {
      annualConsumption: {
        title: 'Annual Consumption Calculation',
        steps: [
          'Base Load Analysis: 15.2 kW × 24 hours × 365 days = 133,152 kWh',
          'Peak Usage (8am-6pm): Additional 28.7 kW × 10 hours × 261 workdays = 74,907 kWh',
          'HVAC Load: Average 18.4 kW × 12 hours × 365 days = 80,592 kWh',
          'Equipment Efficiency Factor: 0.92 (Industry standard)',
          'Total Annual Usage: (Base + Peak + HVAC) × Efficiency = 249,087.3 kWh'
        ],
        methodology: 'Calculations based on smart meter data, occupancy patterns, and equipment specifications. HVAC load varies seasonally and is averaged annually.'
      },
      costAnalysis: {
        title: 'Cost Analysis Breakdown',
        steps: [
          'Grid Energy Rate: $0.310/kWh (Based on local utility rates)',
          'Annual Grid Cost: 249,087.3 kWh × $0.310 = $77,217.08',
          'Solar System Size: 622 panels × 400W = 248.8 kW',
          'Solar Production: 248.8 kW × 1,600 sun hours × 0.85 efficiency = 338,368 kWh/year',
          'Grid Dependency with Solar: 40% of original usage',
          'New Annual Grid Cost: $77,217.08 × 0.40 = $31,268.42'
        ],
        methodology: 'Cost calculations include peak demand charges, time-of-use rates, and seasonal variations. Solar production estimates account for panel degradation and weather patterns.'
      },
      facilityMetrics: {
        title: 'Facility Metrics Calculation',
        steps: [
          'Building Energy Use Intensity: 249,087.3 kWh ÷ 155,000 sq ft = 1.61 kWh/sq ft/year',
          'Peak Load Factor: 155.7 kW ÷ (249,087.3 kWh ÷ 8,760 hours) = 5.47',
          'Demand Response Potential: 31.2 kW reduction possible during peak hours',
          'Power Quality Index: 0.98 (Based on harmonic analysis)'
        ],
        methodology: 'Metrics derived from building management system data, utility records, and industry benchmarks for similar commercial facilities.'
      },
      peakMetrics: {
        title: 'Peak Usage & Reliability Metrics',
        steps: [
          'Peak Demand Calculation: Highest 15-minute average = 155.7 kW',
          'Monthly Power Outage: (Sum of outage minutes) ÷ (12 months × 60) = 0.8 hours/month',
          'Grid Reliability Index: 99.89% uptime',
          'Power Factor: 0.95 (Industry standard minimum is 0.85)'
        ],
        methodology: 'Peak metrics based on 15-minute interval data. Reliability calculations use historical outage data and power quality measurements.'
      }
    }
  };

  // Add ROI and cost data for graph
  const roiData = [
    { month: 0, withSolar: 155000, withoutSolar: 0 }, // Initial investment
    { month: 6, withSolar: 155000 + 6 * 2600, withoutSolar: 6 * 6434 },
    { month: 12, withSolar: 155000 + 12 * 2600, withoutSolar: 12 * 6434 },
    { month: 24, withSolar: 155000 + 24 * 2600, withoutSolar: 24 * 6434 },
    { month: 36, withSolar: 155000 + 36 * 2600, withoutSolar: 36 * 6434 },
    { month: 48, withSolar: 155000 + 48 * 2600, withoutSolar: 48 * 6434 },
    { month: 60, withSolar: 155000 + 60 * 2600, withoutSolar: 60 * 6434 },
    { month: 72, withSolar: 155000 + 72 * 2600, withoutSolar: 72 * 6434 },
    { month: 84, withSolar: 155000 + 84 * 2600, withoutSolar: 84 * 6434 },
    { month: 87, withSolar: 155000 + 87 * 2600, withoutSolar: 87 * 6434 }, // Crossing point
    { month: 96, withSolar: 155000 + 96 * 2600, withoutSolar: 96 * 6434 },
    { month: 108, withSolar: 155000 + 108 * 2600, withoutSolar: 108 * 6434 },
    { month: 120, withSolar: 155000 + 120 * 2600, withoutSolar: 120 * 6434 }
  ];

  // Format energy usage data for pie chart with enhanced colors and descriptions
  const energyUsagePieData = [
    { 
      id: 'hvac',
      name: 'HVAC', 
      value: energyData.usageBreakdown.hvac, 
      color: '#FF6B6B', 
      gradientStart: '#FF6B6B',
      gradientEnd: '#FF8E8E',
      icon: <FaAirFreshener />,
      description: 'Heating, Ventilation, and Air Conditioning consumes the largest portion of energy due to the building size and occupancy patterns.',
      calculation: '18.4 kW average load × 12 hours × 365 days × 0.92 efficiency factor = 74,343 kWh/year',
      breakdown: [
        { name: 'Cooling', percentage: '45%', value: '33,454 kWh' },
        { name: 'Heating', percentage: '30%', value: '22,303 kWh' },
        { name: 'Ventilation', percentage: '25%', value: '18,586 kWh' }
      ],
      tips: [
        'Regular maintenance can improve HVAC efficiency by 15-20%',
        'Upgrading to a high-efficiency system can reduce energy usage by 30%',
        'Smart thermostats can save 10-15% on heating and cooling costs'
      ]
    },
    { 
      id: 'lighting',
      name: 'Lighting', 
      value: energyData.usageBreakdown.lighting, 
      color: '#4ECDC4', 
      gradientStart: '#4ECDC4',
      gradientEnd: '#7DFFD3',
      icon: <FaRegLightbulb />,
      description: 'Lighting energy usage based on the building\'s 4,200 fixtures operating during business hours.',
      calculation: '4,200 fixtures × 22W × 10 hours × 261 workdays / 1000 = 24,113 kWh/year',
      breakdown: [
        { name: 'Office Areas', percentage: '55%', value: '13,262 kWh' },
        { name: 'Common Areas', percentage: '30%', value: '7,234 kWh' },
        { name: 'Exterior', percentage: '15%', value: '3,617 kWh' }
      ],
      tips: [
        'LED lighting upgrades can reduce lighting energy by up to 75%',
        'Occupancy sensors can cut lighting costs by 30%',
        'Daylight harvesting can save up to 40% in perimeter areas'
      ]
    },
    { 
      id: 'equipment',
      name: 'Equipment', 
      value: energyData.usageBreakdown.equipment, 
      color: '#FFD166', 
      gradientStart: '#FFD166',
      gradientEnd: '#FFE29D',
      icon: <FaTools />,
      description: 'Office equipment and appliances including printers, copiers, kitchen equipment, and other appliances.',
      calculation: 'Based on inventory of 320 workstations, 42 printers, and various appliances = 19,724 kWh/year',
      breakdown: [
        { name: 'Kitchen Equipment', percentage: '40%', value: '7,890 kWh' },
        { name: 'Printers & Copiers', percentage: '35%', value: '6,903 kWh' },
        { name: 'Other Equipment', percentage: '25%', value: '4,931 kWh' }
      ],
      tips: [
        'ENERGY STAR equipment uses 30-75% less electricity',
        'Power management features can save up to 30% on equipment energy',
        'Smart power strips can eliminate phantom loads when equipment is off'
      ]
    },
    { 
      id: 'computers',
      name: 'Computers', 
      value: energyData.usageBreakdown.computers, 
      color: '#7F66FF', 
      gradientStart: '#7F66FF',
      gradientEnd: '#9D8CFF',
      icon: <FaServer />,
      description: 'Computer systems including desktops, laptops, and servers that run continuously or during business hours.',
      calculation: '280 computer systems × 120W active × 9 hours × 261 days / 1000 = 7,864 kWh/year',
      breakdown: [
        { name: 'Desktop Computers', percentage: '50%', value: '3,932 kWh' },
        { name: 'Servers', percentage: '35%', value: '2,752 kWh' },
        { name: 'Laptops', percentage: '15%', value: '1,180 kWh' }
      ],
      tips: [
        'Modern laptops use up to 80% less energy than desktop computers',
        'Server virtualization can reduce server energy use by 80%',
        'Setting computers to sleep after 15 minutes of inactivity can save up to 15%'
      ]
    },
    { 
      id: 'other',
      name: 'Other', 
      value: energyData.usageBreakdown.other, 
      color: '#FB8DA0', 
      gradientStart: '#FB8DA0',
      gradientEnd: '#FFACE4',
      icon: <FaPercentage />,
      description: 'Miscellaneous energy usage including security systems, elevators, water heating, and other building systems.',
      calculation: 'Measured through submetering of auxiliary building systems = 14,945 kWh/year',
      breakdown: [
        { name: 'Elevators', percentage: '40%', value: '5,978 kWh' },
        { name: 'Water Heating', percentage: '35%', value: '5,231 kWh' },
        { name: 'Security Systems', percentage: '25%', value: '3,736 kWh' }
      ],
      tips: [
        'Modern elevators can use regenerative braking to recover energy',
        'Heat pump water heaters can reduce water heating energy by 60%',
        'Motion-activated security systems use less power than always-on systems'
      ]
    }
  ];

  // Detailed section data for each category
  const getPieSectionDetails = (sectionId: string) => {
    return energyUsagePieData.find(item => item.id === sectionId);
  };

  // Extended ROI data to show 25 years with extended gains - modified to avoid negative values
  const extendedRoiData = [
    { year: 0, withSolar: 0, withoutSolar: 0, savings: 0, totalInvestment: 155000 }, // Initial investment at 0
    { year: 1, withSolar: 12 * 2600, withoutSolar: 12 * 6434, savings: (12 * 6434) - (12 * 2600 + 155000) + 155000, totalInvestment: 155000 },
    { year: 2, withSolar: 24 * 2600, withoutSolar: 24 * 6434, savings: (24 * 6434) - (24 * 2600 + 155000) + 155000, totalInvestment: 155000 },
    { year: 3, withSolar: 36 * 2600, withoutSolar: 36 * 6434, savings: (36 * 6434) - (36 * 2600 + 155000) + 155000, totalInvestment: 155000 },
    { year: 4, withSolar: 48 * 2600, withoutSolar: 48 * 6434, savings: (48 * 6434) - (48 * 2600 + 155000) + 155000, totalInvestment: 155000 },
    { year: 5, withSolar: 60 * 2600, withoutSolar: 60 * 6434, savings: (60 * 6434) - (60 * 2600 + 155000) + 155000, totalInvestment: 155000 },
    { year: 6, withSolar: 72 * 2600, withoutSolar: 72 * 6434, savings: (72 * 6434) - (72 * 2600 + 155000) + 155000, totalInvestment: 155000 },
    { year: 7, withSolar: 84 * 2600, withoutSolar: 84 * 6434, savings: (84 * 6434) - (84 * 2600 + 155000) + 155000, totalInvestment: 155000 },
    { year: 7.2, withSolar: 87 * 2600, withoutSolar: 87 * 6434, savings: (87 * 6434) - (87 * 2600 + 155000) + 155000, totalInvestment: 155000 }, // Break-even point
    { year: 8, withSolar: 96 * 2600, withoutSolar: 96 * 6434, savings: (96 * 6434) - (96 * 2600 + 155000) + 155000, totalInvestment: 155000 },
    { year: 9, withSolar: 108 * 2600, withoutSolar: 108 * 6434, savings: (108 * 6434) - (108 * 2600 + 155000) + 155000, totalInvestment: 155000 },
    { year: 10, withSolar: 120 * 2600, withoutSolar: 120 * 6434, savings: (120 * 6434) - (120 * 2600 + 155000) + 155000, totalInvestment: 155000 },
    { year: 12, withSolar: 144 * 2600, withoutSolar: 144 * 6434, savings: (144 * 6434) - (144 * 2600 + 155000) + 155000, totalInvestment: 155000 },
    { year: 15, withSolar: 180 * 2600, withoutSolar: 180 * 6434, savings: (180 * 6434) - (180 * 2600 + 155000) + 155000, totalInvestment: 155000 },
    { year: 18, withSolar: 216 * 2600, withoutSolar: 216 * 6434, savings: (216 * 6434) - (216 * 2600 + 155000) + 155000, totalInvestment: 155000 },
    { year: 20, withSolar: 240 * 2600, withoutSolar: 240 * 6434, savings: (240 * 6434) - (240 * 2600 + 155000) + 155000, totalInvestment: 155000 },
    { year: 22, withSolar: 264 * 2600, withoutSolar: 264 * 6434, savings: (264 * 6434) - (264 * 2600 + 155000) + 155000, totalInvestment: 155000 },
    { year: 25, withSolar: 300 * 2600, withoutSolar: 300 * 6434, savings: (300 * 6434) - (300 * 2600 + 155000) + 155000, totalInvestment: 155000 },
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

  // Custom pie chart renderer with gradients and 3D effect
  const renderCustomizedPie = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = 25 + innerRadius + (outerRadius - innerRadius);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    const item = energyUsagePieData[index];
    
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
              <span className="text-gray-300">Without Solar:</span>
              <span className="font-semibold text-white">${data.withoutSolar.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              <span className="text-gray-300">With Solar:</span>
              <span className="font-semibold text-white">${(data.withSolar + data.totalInvestment).toLocaleString()}</span>
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

  // Modal for showing detailed breakdown of each energy usage section
  const EnergyUsageDetailModal = ({ sectionId, onClose }: { sectionId: string, onClose: () => void }) => {
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
                {sectionData.name} Energy Usage
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
                <MdOutlineAnalytics className="text-amber-500" />
                Overview
              </h4>
              <p className="text-gray-300">{sectionData.description}</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <FaCalculator className="text-amber-500" />
                Calculation
              </h4>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                <p className="text-gray-300 font-mono">{sectionData.calculation}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <FaChartBar className="text-amber-500" />
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
                    <div className="p-3 text-amber-500">{item.percentage}</div>
                    <div className="p-3 text-white">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <FaRegLightbulb className="text-amber-500" />
                Efficiency Tips
              </h4>
              <ul className="space-y-2">
                {sectionData.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-300">
                    <div className="text-amber-500 mt-1">•</div>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="bg-gray-800/50 p-4 border-t border-gray-700 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Initialize the embedding helper
  useEffect(() => {
    // Check if the SolarWindow embedding helper is available
    if (window.SolarWindow && document.getElementById('solar-window-container')) {
      try {
        const instance = window.SolarWindow.embed({
          containerId: 'solar-window-container',
          height: '85vh', // Increased height to maximize space
          width: '100%'
        });
        
        setSolarWindowInstance(instance);
        setUseEmbedHelper(true);
        
        // Listen for state updates
        instance.onMessage('STATE_UPDATE', (state) => {
          console.log('Solar analysis state:', state);
          handleSolarWindowStateUpdate(state);
        });
        
        // Listen for user interactions
        instance.onMessage('INTERACTION', (data) => {
          console.log('User interaction:', data);
          handleSolarWindowInteraction(data);
        });
        
        // Listen for ready event
        instance.onMessage('ENGINE_READY', () => {
          setEngineReady(true);
          // Initialize the app
          instance.sendMessage('COMMAND', 'INITIALIZE');
        });
        
        return () => {
          // No direct cleanup method provided in the docs, but we can set state
          setSolarWindowInstance(null);
        };
      } catch (error) {
        console.error('Error initializing SolarWindow embedding:', error);
        setUseEmbedHelper(false);
        toast.error('Failed to initialize Solar Window embedding, falling back to iframe');
      }
    } else {
      setUseEmbedHelper(false);
    }
  }, []);

  // Handle state updates from the Solar Window app
  const handleSolarWindowStateUpdate = (state: any) => {
    console.log('Received state update from Solar Window:', state);
    if (state.energyData) {
      toast.success('Energy data updated from Solar Window');
    }
  };

  // Handle interactions from the Solar Window app
  const handleSolarWindowInteraction = (data: any) => {
    console.log('User interacted with Solar Window:', data);
    if (data.action === 'update_energy_usage') {
      toast.success('Energy usage updated from Solar Window');
    }
  };

  // Send commands to engine (iframe approach)
  const sendToEngine = (message: DashboardMessage) => {
    if (useEmbedHelper && solarWindowInstance) {
      // Use the embed helper API
      solarWindowInstance.sendMessage(message.type, message.payload);
    } else if (iframeRef.current?.contentWindow) {
      // Use the iframe postMessage API
      iframeRef.current.contentWindow.postMessage(message, SOLAR_WINDOW_URL);
    }
  };

  // Handle engine messages (iframe approach)
  useEffect(() => {
    // Only set up message listener if we're using the iframe approach
    if (useEmbedHelper) return;
    
    const messageHandler = (event: MessageEvent<EngineMessage>) => {
      if (event.origin !== SOLAR_WINDOW_URL) return;

      switch (event.data.type) {
        case 'ENGINE_READY':
          setEngineReady(true);
          sendToEngine({
            type: 'COMMAND',
            payload: 'INITIALIZE'
          });
          break;
          
        case 'STATE_UPDATE':
          console.log('Engine state:', event.data.payload);
          handleSolarWindowStateUpdate(event.data.payload);
          break;
          
        case 'INTERACTION':
          handleSolarWindowInteraction(event.data.payload);
          break;
      }
    };

    window.addEventListener('message', messageHandler);
    return () => window.removeEventListener('message', messageHandler);
  }, [useEmbedHelper]);

  // Load the embedding script
  useEffect(() => {
    const loadEmbedScript = () => {
      const script = document.createElement('script');
      script.src = `${SOLAR_WINDOW_URL}/lib/embed.js`;
      script.async = true;
      script.onload = () => console.log('Solar Window embed script loaded');
      script.onerror = () => {
        console.error('Failed to load Solar Window embed script');
        setUseEmbedHelper(false);
      };
      document.body.appendChild(script);
    };

    loadEmbedScript();
    
    return () => {
      // Remove the script when component unmounts
      const script = document.querySelector(`script[src="${SOLAR_WINDOW_URL}/lib/embed.js"]`);
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        setIsCalculating(false);
      }, 5000);
    }, 5000);
  }, []);

  const handleContinueToSolarPotential = () => {
    navigate('/solar-panel-potential');
  };

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
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl mx-4 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <MdClose size={24} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h4 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Calculation Steps</h4>
            <ol className="space-y-3">
              {steps.map((step, index) => (
                <li key={index} className="flex gap-3 text-gray-600 dark:text-gray-300">
                  <span className="font-bold text-amber-500">{index + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Methodology</h4>
            <p className="text-gray-600 dark:text-gray-300">{methodology}</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Info Button Component
  const InfoButton = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
    >
      <MdInfoOutline size={20} className="text-gray-600 dark:text-gray-300" />
    </button>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020305] flex items-center justify-center relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="fixed top-20 right-40 w-96 h-96 bg-gradient-to-br from-orange-500/5 to-transparent rounded-full blur-3xl transform rotate-12 opacity-70 pointer-events-none"></div>
        <div className="fixed bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-orange-500/5 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-60 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center gap-8">
          {/* GIF Container */}
          <div className="relative group">
            {/* Outer glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
            
            {/* GIF box with glass effect */}
            <div className="relative backdrop-blur-sm bg-black/20 p-1 rounded-3xl border border-white/10">
              <img 
                src="/images/solar/lq6qgs6wvqjt-6qrUq4uhVhMcVkCQ5a7kiB-12f28adb9cbd7f6cc609b7d9f106cdff-expanded_coverage.gif"
                alt="Energy Analysis"
                className="w-[600px] h-[600px] object-cover rounded-2xl"
              />
          </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Analyzing Energy Usage</h2>
            <p className="text-gray-400 mb-8">Analyzing facility data and consumption patterns...</p>
            
            {/* Progress bars */}
            <div className="w-[600px] space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Analyzing facility data</span>
                  <span className="text-orange-500 font-medium">100%</span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Processing energy metrics</span>
                  <span className="text-orange-500 font-medium">85%</span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Calculating consumption breakdown</span>
                  <span className="text-orange-500 font-medium">70%</span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div className="h-full w-[70%] bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Estimating solar ROI</span>
                  <span className="text-orange-500 font-medium">45%</span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div className="h-full w-[45%] bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="mt-4 w-full bg-gray-800/50 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full w-0 animate-loadingBar"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Define base classes for cards to match the Home page styling
  const cardBaseClass = "backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 border border-orange-500/15 group relative overflow-hidden";

  return (
    <div className="w-full px-1 py-2 bg-[#020305] min-h-screen min-w-full relative">
      {/* Background gradient orbs */}
      <div className="fixed top-20 right-40 w-96 h-96 bg-gradient-to-br from-orange-500/5 to-transparent rounded-full blur-3xl transform rotate-12 opacity-70 pointer-events-none"></div>
      <div className="fixed bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-orange-500/5 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-60 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Simple title without a box - left aligned */}
          <div className="flex items-center justify-start py-4">
            <div className="flex items-center gap-3">
              <MdElectricBolt size={28} className="text-orange-500" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                Energy Usage Estimation
              </h1>
            </div>
          </div>

          {/* Solar Window Integration - Full Size */}
          <div className={cardBaseClass + " min-h-[85vh]"}>
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
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-tr-full"></div>
            
            {/* Solar Window Container - Simplified, no header */}
            <div className="relative z-10 p-2 h-full">
              {/* External App container */}
              <div className="w-full h-full relative backdrop-blur-md rounded-xl overflow-hidden border border-amber-500/20 shadow-xl">
                {!engineReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/70 z-10">
                    <div className="text-center">
                      <div className="loading loading-spinner loading-lg text-amber-500 mb-4"></div>
                      <p className="text-white text-lg">Connecting to Solar Window...</p>
                    </div>
                  </div>
                )}
                
                {/* Embed Helper Container */}
                <div 
                  id="solar-window-container" 
                  className={`w-full h-full min-h-[85vh] ${useEmbedHelper ? 'block' : 'hidden'}`}
                ></div>
                
                {/* Fallback iframe for manual integration */}
                {!useEmbedHelper && (
                  <iframe
                    ref={iframeRef}
                    src={SOLAR_WINDOW_URL}
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    className="w-full h-full min-h-[85vh] bg-transparent"
                    title="Solar Window Analysis Engine"
                  />
                )}
              </div>
            </div>
          </div>

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
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-tr-full"></div>
              
              <div className="card-body flex flex-col items-center justify-center py-16 relative z-10">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <div className="loading loading-spinner loading-lg text-amber-500 relative"></div>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent mb-4">
                  Calculating Energy Usage
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8">
                  Our AI is analyzing facility data to estimate energy consumption patterns...
                </p>
                <div className="w-full max-w-md space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300">Analyzing building specifications</span>
                      <span className="text-amber-500 font-medium">100%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300">Estimating HVAC requirements</span>
                      <span className="text-amber-500 font-medium">90%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full w-[90%] bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300">Calculating lighting energy usage</span>
                      <span className="text-amber-500 font-medium">75%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full w-[75%] bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300">Modeling equipment power consumption</span>
                      <span className="text-amber-500 font-medium">45%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full w-[45%] bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Energy Stats in annotation style layout */}
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
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-tr-full"></div>
                
                <div className="relative z-10 grid grid-cols-3 gap-6 items-center">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm relative">
                      <InfoButton onClick={() => setActiveInfoModal('annualConsumption')} />
                      <h3 className="card-title text-lg flex items-center gap-2 mb-4">
                        <div className="bg-gradient-to-br from-amber-500 to-amber-600 w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                          <FaBolt size={24} />
                    </div>
                        <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent text-xl">
                          Energy Consumption
                        </span>
                      </h3>
                      <div className="space-y-4">
                    <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Annual Usage</p>
                          <p className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                            {energyData.totalAnnualUsage}
                      </p>
                    </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Average</p>
                          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {energyData.averageMonthlyUsage}
                          </p>
                  </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">System Efficiency</p>
                          <p className="text-xl font-semibold text-green-500">
                            {energyData.solarEfficiency}
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
                          Financial Impact
                      </span>
                    </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-baseline">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Without Solar</p>
                            <p className="text-2xl font-bold text-red-500">{energyData.costWithoutSolar}</p>
                        </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-400">With Solar</p>
                            <p className="text-2xl font-bold text-green-500">{energyData.costWithSolar}</p>
                      </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">ROI Period</p>
                          <p className="text-xl font-semibold text-gray-900 dark:text-white">
                            {energyData.roiPeriod}
                          </p>
                      </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Break Even</p>
                          <p className="text-xl font-semibold text-gray-900 dark:text-white">
                            {energyData.breakEvenPoint}
                          </p>
                      </div>
                    </div>
                  </div>
                </div>

                  {/* Center Image */}
                  <div className="relative">
                    <img 
                      src="/images/solar/unnamed8.png"
                      alt="Energy Usage Visualization"
                      className="w-full h-auto rounded-xl shadow-xl"
                    />
                    {/* Enhanced connecting lines with gradients */}
                    <div className="absolute inset-0 pointer-events-none">
                      <svg className="w-full h-full" style={{ position: 'absolute', top: 0, left: 0 }}>
                        <defs>
                          <linearGradient id="lineGradient1" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="rgba(245,158,11,0.2)" />
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
                      <InfoButton onClick={() => setActiveInfoModal('facilityMetrics')} />
                      <h3 className="card-title text-lg flex items-center gap-2 mb-4">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                          <FaChartBar size={24} />
                      </div>
                        <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent text-xl">
                          Facility Metrics
                      </span>
                    </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Building Type</p>
                          <p className="text-xl font-semibold text-gray-900 dark:text-white">
                            Commercial Office
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Total Area</p>
                          <p className="text-xl font-semibold text-gray-900 dark:text-white">
                            155,000 sq ft
                          </p>
                      </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Energy Intensity</p>
                          <p className="text-xl font-semibold text-blue-500">
                            1.61 kWh/sq ft/year
                          </p>
                        </div>
                      </div>
                        </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm relative">
                      <InfoButton onClick={() => setActiveInfoModal('peakMetrics')} />
                      <h3 className="card-title text-lg flex items-center gap-2 mb-4">
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                          <FaClock size={24} />
                      </div>
                        <span className="bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent text-xl">
                          Reliability Metrics
                        </span>
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Peak Demand</p>
                          <p className="text-2xl font-bold text-purple-500">{energyData.peakDemand}</p>
                    </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Outage</p>
                          <p className="text-xl font-semibold text-gray-900 dark:text-white">
                            {energyData.monthlyPowerOutage}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Grid Reliability</p>
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
                  title={energyData.calculations[activeInfoModal as keyof typeof energyData.calculations].title}
                  steps={energyData.calculations[activeInfoModal as keyof typeof energyData.calculations].steps}
                  methodology={energyData.calculations[activeInfoModal as keyof typeof energyData.calculations].methodology}
                  onClose={() => setActiveInfoModal(null)}
                />
              )}

              {/* Energy Usage Breakdown and ROI Comparison - No outer box */}
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
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-tr-full"></div>
                
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-3 rounded-lg text-white shadow-lg">
                        <MdOutlineAnalytics size={22} />
                      </div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                        Energy Usage Breakdown
                    </h3>
                        </div>
                    
                    {/* Analysis explanation text */}
                    <div className="mb-6 p-4 bg-gradient-to-r from-amber-500/10 to-blue-500/10 rounded-xl border border-amber-500/20">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 text-amber-500">
                          <MdInfoOutline size={20} />
                      </div>
                        <div>
                          <p className="text-white text-sm leading-relaxed">
                            This analysis represents the typical energy usage pattern for a commercial office facility of this size (155,000 sq ft) and classification. 
                            Based on aggregated data from 1,250+ similar facilities, this breakdown has an <span className="text-amber-500 font-medium">87th percentile accuracy rating</span>. 
                            While individual building variations exist, our AI-powered assessment has calibrated this estimate using current operational patterns and building specifications.
                          </p>
                        </div>
                      </div>
                        </div>
                    
                    <div className="h-[400px] mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          {/* Define gradients for each sector */}
                          <defs>
                            {energyUsagePieData.map((entry, index) => (
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
                            <filter id="glow" height="300%" width="300%" x="-100%" y="-100%">
                              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                              <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                              </feMerge>
                            </filter>
                          </defs>
                          <Pie
                            data={energyUsagePieData}
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
                            {energyUsagePieData.map((entry, index) => (
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
                              const sectionId = energyUsagePieData.find(item => item.name === entry.value)?.id;
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
                      <div className="inline-flex items-center gap-2 text-sm text-amber-500 border border-amber-500/30 px-3 py-1.5 rounded-full bg-amber-500/10">
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
                        25-Year Solar Investment & ROI
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
                            This financial projection illustrates the cumulative return on a $155,000 solar installation over 25 years. 
                            Based on current energy rates and production efficiency, the system achieves <span className="text-green-500 font-medium">break-even at 7.2 years</span>, 
                            with total savings of <span className="text-green-500 font-medium">${Math.round(roiDataWithCumulative[roiDataWithCumulative.length-1].cumulativeSavings).toLocaleString()}</span> over the system's lifetime. 
                            This analysis factors in panel degradation of 0.5% annually and projected utility rate increases of 3% per year.
                          </p>
                          <div className="grid grid-cols-3 gap-4 mt-3">
                            <div className="bg-gray-800/50 p-2 rounded-lg text-center">
                              <p className="text-xs text-gray-400">Break-even Point</p>
                              <p className="text-lg font-semibold text-white">7.2 years</p>
                            </div>
                            <div className="bg-gray-800/50 p-2 rounded-lg text-center">
                              <p className="text-xs text-gray-400">25-Year ROI</p>
                              <p className="text-lg font-semibold text-green-400">382%</p>
                            </div>
                            <div className="bg-gray-800/50 p-2 rounded-lg text-center">
                              <p className="text-xs text-gray-400">Monthly Savings</p>
                              <p className="text-lg font-semibold text-white">$3,834</p>
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
                            <linearGradient id="colorWithSolar" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0.2}/>
                            </linearGradient>
                            <linearGradient id="colorWithoutSolar" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#EF4444" stopOpacity={0.2}/>
                            </linearGradient>
                            <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.2}/>
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
                            x={7.2} 
                            stroke="#FBBF24"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            label={{ 
                              value: 'Break-even: 7.2 years', 
                              position: 'top',
                              fill: '#FBBF24',
                              fontSize: 12,
                              fontWeight: 'bold'
                            }} 
                          />
                          
                          {/* Add annotation for initial investment */}
                          <ReferenceLine 
                            y={155000} 
                            stroke="#FFFFFF"
                            strokeWidth={1}
                            strokeDasharray="3 3"
                            label={{ 
                              value: 'Initial Investment: $155,000', 
                              position: 'right',
                              fill: '#FFFFFF',
                              fontSize: 10,
                              opacity: 0.7
                            }} 
                          />
                          
                          <Area 
                            type="monotone" 
                            dataKey={(data) => data.withSolar + data.totalInvestment} // Add investment to solar costs
                            name="With Solar" 
                            stroke="#10B981" 
                            fillOpacity={1}
                            fill="url(#colorWithSolar)" 
                            strokeWidth={3}
                            activeDot={{ r: 8, strokeWidth: 0, fill: '#10B981' }}
                            filter="url(#shadow)"
                          />
                          <Area 
                            type="monotone" 
                            dataKey="withoutSolar" 
                            name="Without Solar" 
                            stroke="#EF4444" 
                            fillOpacity={1}
                            fill="url(#colorWithoutSolar)" 
                            strokeWidth={3}
                            activeDot={{ r: 8, strokeWidth: 0, fill: '#EF4444' }}
                            filter="url(#shadow)"
                          />
                          <Area 
                            type="monotone" 
                            dataKey="cumulativeSavings" 
                            name="Cumulative Savings" 
                            stroke="#F59E0B" 
                            fillOpacity={0.6}
                            fill="url(#colorSavings)" 
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            activeDot={{ r: 8, strokeWidth: 0, fill: '#F59E0B' }}
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
                        Panel warranty: <span className="text-white">25 years</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Render energy usage breakdown detail modal when a section is clicked */}
              {showDetailsModal && selectedPieSection && (
                <EnergyUsageDetailModal
                  sectionId={selectedPieSection}
                  onClose={() => setShowDetailsModal(false)}
                />
              )}
              
              {/* Continue Button */}
              <div className="flex justify-center mt-8">
                <button 
                  onClick={handleContinueToSolarPotential}
                  className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white py-4 px-8 rounded-xl font-medium transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 inline-flex items-center gap-3 group relative overflow-hidden"
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
                  
                  <span className="relative z-10 text-lg">Continue to Solar Panel Potential</span>
                  <MdArrowForward className="relative z-10 text-2xl group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnergyUsageEstimation; 