import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdElectricBolt, MdOutlineCalendarMonth, MdOutlineQueryStats, MdOutlineShowChart, MdOutlineWbSunny, MdArrowUpward, MdArrowDownward, MdMap } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const EnergyUsage = () => {
  const navigate = useNavigate();
  const [facilityData, setFacilityData] = useState<any>(null);
  const [energyData, setEnergyData] = useState({
    monthlyUsage: [
      { month: 'Jan', usage: 95000, baseline: 110000 },
      { month: 'Feb', usage: 92000, baseline: 105000 },
      { month: 'Mar', usage: 98000, baseline: 108000 },
      { month: 'Apr', usage: 105000, baseline: 112000 },
      { month: 'May', usage: 115000, baseline: 120000 },
      { month: 'Jun', usage: 125000, baseline: 130000 },
      { month: 'Jul', usage: 135000, baseline: 140000 },
      { month: 'Aug', usage: 130000, baseline: 138000 },
      { month: 'Sep', usage: 120000, baseline: 125000 },
      { month: 'Oct', usage: 110000, baseline: 115000 },
      { month: 'Nov', usage: 100000, baseline: 105000 },
      { month: 'Dec', usage: 98000, baseline: 102000 }
    ],
    hourlyUsage: [
      { hour: '12am', usage: 45 },
      { hour: '2am', usage: 40 },
      { hour: '4am', usage: 38 },
      { hour: '6am', usage: 42 },
      { hour: '8am', usage: 68 },
      { hour: '10am', usage: 85 },
      { hour: '12pm', usage: 92 },
      { hour: '2pm', usage: 95 },
      { hour: '4pm', usage: 90 },
      { hour: '6pm', usage: 75 },
      { hour: '8pm', usage: 65 },
      { hour: '10pm', usage: 50 }
    ],
    solarProduction: [
      { month: 'Jan', production: 25000 },
      { month: 'Feb', production: 28000 },
      { month: 'Mar', production: 35000 },
      { month: 'Apr', production: 42000 },
      { month: 'May', production: 48000 },
      { month: 'Jun', production: 52000 },
      { month: 'Jul', production: 55000 },
      { month: 'Aug', production: 50000 },
      { month: 'Sep', production: 45000 },
      { month: 'Oct', production: 38000 },
      { month: 'Nov', production: 30000 },
      { month: 'Dec', production: 26000 }
    ],
    peakDemandTimes: [
      { time: '9am-11am', percentage: 15 },
      { time: '11am-1pm', percentage: 25 },
      { time: '1pm-3pm', percentage: 30 },
      { time: '3pm-5pm', percentage: 20 },
      { time: '5pm-7pm', percentage: 10 }
    ],
    energySourceMix: [
      { source: 'Grid', percentage: 65 },
      { source: 'Solar', percentage: 35 }
    ],
    usageByEquipment: [
      { equipment: 'HVAC', percentage: 35 },
      { equipment: 'Lighting', percentage: 20 },
      { equipment: 'Machinery', percentage: 30 },
      { equipment: 'Office', percentage: 10 },
      { equipment: 'Other', percentage: 5 }
    ],
    solarVsGrid: [
      { month: 'Jan', solar: 25000, grid: 70000 },
      { month: 'Feb', solar: 28000, grid: 64000 },
      { month: 'Mar', solar: 35000, grid: 63000 },
      { month: 'Apr', solar: 42000, grid: 63000 },
      { month: 'May', solar: 48000, grid: 67000 },
      { month: 'Jun', solar: 52000, grid: 73000 },
      { month: 'Jul', solar: 55000, grid: 80000 },
      { month: 'Aug', solar: 50000, grid: 80000 },
      { month: 'Sep', solar: 45000, grid: 75000 },
      { month: 'Oct', solar: 38000, grid: 72000 },
      { month: 'Nov', solar: 30000, grid: 70000 },
      { month: 'Dec', solar: 26000, grid: 72000 }
    ],
    costSavings: [
      { month: 'Jan', withSolar: 21700, withoutSolar: 34100 },
      { month: 'Feb', withSolar: 20832, withoutSolar: 32550 },
      { month: 'Mar', withSolar: 19530, withoutSolar: 33480 },
      { month: 'Apr', withSolar: 19530, withoutSolar: 34720 },
      { month: 'May', withSolar: 20770, withoutSolar: 37200 },
      { month: 'Jun', withSolar: 22630, withoutSolar: 40300 },
      { month: 'Jul', withSolar: 24800, withoutSolar: 43400 },
      { month: 'Aug', withSolar: 24800, withoutSolar: 42780 },
      { month: 'Sep', withSolar: 23250, withoutSolar: 38750 },
      { month: 'Oct', withSolar: 22320, withoutSolar: 35650 },
      { month: 'Nov', withSolar: 21700, withoutSolar: 32550 },
      { month: 'Dec', withSolar: 22320, withoutSolar: 31620 }
    ]
  });

  // Load facility data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem('facilityData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setFacilityData(parsedData);
      } catch (error) {
        console.error('Error parsing stored facility data:', error);
      }
    } else {
      toast.error('No facility data found. Please complete the facility information first.');
      navigate('/facility-calculator');
    }
  }, [navigate]);

  // Calculate energy metrics
  const calculateEnergyMetrics = () => {
    if (!facilityData) return null;

    const annualEnergyUsage = parseFloat(facilityData.annualEnergyUsage) || 1250000;
    const utilityRate = parseFloat(facilityData.currentUtilityRate) || 0.31;
    const squareFootage = parseFloat(facilityData.squareFootage) || 75000;
    const panelCount = parseFloat(facilityData.panelCount) || 622;
    const panelCapacity = parseFloat(facilityData.panelCapacity) || 250;
    
    // Calculate total annual energy cost
    const annualEnergyCost = annualEnergyUsage * utilityRate;
    
    // Calculate energy usage per square foot
    const energyPerSqFt = annualEnergyUsage / squareFootage;
    
    // Calculate total solar production
    const annualSunHours = 1600; // Average annual sun hours
    const solarEfficiencyFactor = 0.18; // 18% efficiency for commercial solar panels
    const annualSolarProduction = panelCount * panelCapacity * annualSunHours * solarEfficiencyFactor / 1000;
    
    // Calculate percentage of energy covered by solar
    const solarCoveragePercentage = (annualSolarProduction / annualEnergyUsage) * 100;
    
    // Calculate cost savings
    const costWithoutSolar = annualEnergyCost;
    const costWithSolar = (annualEnergyUsage - annualSolarProduction) * utilityRate;
    const annualSavings = costWithoutSolar - costWithSolar;
    
    return {
      annualEnergyUsage: annualEnergyUsage.toLocaleString() + ' kWh',
      annualEnergyCost: '$' + annualEnergyCost.toLocaleString(undefined, {maximumFractionDigits: 2}),
      energyPerSqFt: energyPerSqFt.toLocaleString(undefined, {maximumFractionDigits: 1}) + ' kWh/sqft',
      annualSolarProduction: annualSolarProduction.toLocaleString(undefined, {maximumFractionDigits: 0}) + ' kWh',
      solarCoveragePercentage: solarCoveragePercentage.toLocaleString(undefined, {maximumFractionDigits: 0}) + '%',
      costWithoutSolar: '$' + costWithoutSolar.toLocaleString(undefined, {maximumFractionDigits: 2}),
      costWithSolar: '$' + costWithSolar.toLocaleString(undefined, {maximumFractionDigits: 2}),
      annualSavings: '$' + annualSavings.toLocaleString(undefined, {maximumFractionDigits: 2}),
      monthlySavings: '$' + (annualSavings / 12).toLocaleString(undefined, {maximumFractionDigits: 2}),
      dailyUsage: (annualEnergyUsage / 365).toLocaleString(undefined, {maximumFractionDigits: 0}) + ' kWh',
      peakDemand: (annualEnergyUsage * 0.0008).toLocaleString(undefined, {maximumFractionDigits: 0}) + ' kW',
      co2Reduction: ((annualSolarProduction * 0.85) / 2000).toLocaleString(undefined, {maximumFractionDigits: 1}) + ' tons'
    };
  };

  const metrics = calculateEnergyMetrics();

  const handleContinue = () => {
    // In a real app, you would save the energy usage data to your backend
    // For now, we'll just navigate to the next page
    navigate('/solar-efficiency');
  };

  const handleBack = () => {
    navigate('/facility-calculator');
  };

  // Add a solar map visualization component
  const SolarMapVisualization = () => {
    if (!facilityData) return null;
    
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MdMap className="text-xl text-blue-600" /> Solar Potential Map
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 h-64">
            <img 
              src="/images/solar/Screenshot.png" 
              alt="Solar potential heat map" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <h4 className="text-white font-semibold">
                {facilityData.address}, {facilityData.city}, {facilityData.state} {facilityData.zipCode}
              </h4>
              <p className="text-white text-sm">
                Roof area: {(parseFloat(facilityData.squareFootage) * 0.6).toLocaleString()} sq ft available for solar
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-slate-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Solar Potential Analysis</h4>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Yearly Production Potential</p>
                <p className="text-lg font-bold">{metrics?.annualSolarProduction}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Energy Coverage</p>
                <p className="text-lg font-bold">{metrics?.solarCoveragePercentage}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Heat Map Intensity</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-red-600 h-2.5 rounded-full" 
                      style={{ width: `85%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">High</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Optimal Panel Count</p>
                <p className="text-lg font-bold">{facilityData.panelCount} panels</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!facilityData) {
    return <div className="flex justify-center items-center h-screen">Loading facility data...</div>;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-5">
        <div className="box">
          <div className="flex items-center gap-3 mb-5">
            <MdElectricBolt className="text-2xl" />
            <h2 className="text-xl font-bold">Energy Usage Analysis</h2>
          </div>
          
          <p className="mb-5 text-gray-600 dark:text-gray-300">
            Analysis of energy usage patterns and solar potential for {facilityData.facilityName || 'your facility'}.
          </p>

          {/* Energy Metrics Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-slate-800 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Annual Energy Usage</h3>
              <p className="text-xl font-bold">{metrics?.annualEnergyUsage}</p>
            </div>
            <div className="bg-green-50 dark:bg-slate-800 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Annual Energy Cost</h3>
              <p className="text-xl font-bold">{metrics?.annualEnergyCost}</p>
            </div>
            <div className="bg-yellow-50 dark:bg-slate-800 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Energy per Sq Ft</h3>
              <p className="text-xl font-bold">{metrics?.energyPerSqFt}</p>
            </div>
            <div className="bg-purple-50 dark:bg-slate-800 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Peak Demand</h3>
              <p className="text-xl font-bold">{metrics?.peakDemand}</p>
            </div>
          </div>

          {/* Solar Impact Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-100 dark:bg-slate-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MdOutlineWbSunny className="text-xl text-yellow-500" />
                <h3 className="font-semibold">Solar Production</h3>
              </div>
              <p className="text-2xl font-bold">{metrics?.annualSolarProduction}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {metrics?.solarCoveragePercentage} of total energy usage
              </p>
            </div>
            
            <div className="bg-green-100 dark:bg-slate-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MdOutlineQueryStats className="text-xl text-green-500" />
                <h3 className="font-semibold">Cost Comparison</h3>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Without Solar:</p>
                  <p className="text-lg font-bold">{metrics?.costWithoutSolar}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">With Solar:</p>
                  <p className="text-lg font-bold text-green-600">{metrics?.costWithSolar}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-red-100 dark:bg-slate-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MdOutlineShowChart className="text-xl text-red-500" />
                <h3 className="font-semibold">Annual Savings</h3>
              </div>
              <p className="text-2xl font-bold text-green-600">{metrics?.annualSavings}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monthly: {metrics?.monthlySavings}
              </p>
            </div>
          </div>

          {/* Add Solar Map Visualization */}
          <SolarMapVisualization />

          {/* Monthly Usage Chart */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Monthly Energy Usage vs. Solar Production</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={energyData.solarVsGrid}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value.toLocaleString()} kWh`} />
                  <Legend />
                  <Bar dataKey="solar" name="Solar Production" fill="#FFB800" />
                  <Bar dataKey="grid" name="Grid Usage" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cost Savings Chart */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Monthly Cost Comparison</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={energyData.costSavings}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" dataKey="withSolar" name="Cost with Solar" stroke="#00C49F" strokeWidth={2} />
                  <Line type="monotone" dataKey="withoutSolar" name="Cost without Solar" stroke="#FF8042" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily Usage Pattern */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Daily Energy Usage Pattern</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={energyData.hourlyUsage}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} kW`} />
                  <Bar dataKey="usage" name="Power Demand" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Environmental Impact */}
          <div className="bg-green-50 dark:bg-slate-700 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-4">Environmental Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                <h4 className="text-md font-medium mb-2">CO2 Reduction</h4>
                <p className="text-2xl font-bold text-green-600">{metrics?.co2Reduction}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Equivalent to planting {((parseFloat(metrics?.co2Reduction || '0') || 0) * 46.3).toFixed(0)} trees
                </p>
              </div>
              
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                <h4 className="text-md font-medium mb-2">Energy Source Mix</h4>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-yellow-400 h-4 rounded-full" 
                      style={{ width: `${energyData.energySourceMix[1].percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{energyData.energySourceMix[1].percentage}%</span>
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span>Solar</span>
                  <span>Grid</span>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                <h4 className="text-md font-medium mb-2">Sustainability Score</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(parseFloat(metrics?.solarCoveragePercentage || '0') * 0.8)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Based on solar coverage and efficiency
                </p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-blue-50 dark:bg-slate-700 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-4">Energy Optimization Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <MdArrowDownward className="text-xl text-green-500" />
                  <h4 className="font-medium">Peak Demand Reduction</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Shift non-essential operations from peak hours (1pm-3pm) to early morning or evening to reduce demand charges.
                </p>
              </div>
              
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <MdArrowUpward className="text-xl text-blue-500" />
                  <h4 className="font-medium">Solar Expansion</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Increasing solar capacity by 20% would improve coverage to {Math.min(100, Math.round(parseFloat(metrics?.solarCoveragePercentage || '0') * 1.2))}% and reduce grid dependency.
                </p>
              </div>
              
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <MdOutlineCalendarMonth className="text-xl text-purple-500" />
                  <h4 className="font-medium">Seasonal Adjustments</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Energy usage peaks in summer months. Consider additional cooling efficiency measures during July-August.
                </p>
              </div>
              
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <MdOutlineShowChart className="text-xl text-red-500" />
                  <h4 className="font-medium">Equipment Efficiency</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  HVAC systems account for 35% of energy usage. Upgrading to high-efficiency models could reduce consumption by 15%.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Back to Facility Information
            </button>
            <button
              onClick={handleContinue}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Continue to Solar Efficiency
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyUsage; 