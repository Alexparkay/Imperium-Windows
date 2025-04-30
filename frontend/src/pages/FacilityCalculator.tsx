import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdFactory, MdLocationOn, MdPerson, MdEmail, MdPhone, MdBusiness, MdSolarPower, MdAttachMoney, MdElectricBolt, MdOutlineRoofing } from 'react-icons/md';
import { toast } from 'react-hot-toast';

const FacilityCalculator = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Facility Information
    facilityName: '',
    address: '303 S Technology Ct, Broomfield, CO',
    city: 'Broomfield',
    state: 'CO',
    zipCode: '80021',
    squareFootage: '75000',
    industryType: 'Manufacturing',
    operatingHours: '12',
    
    // Contact Information
    managerName: '',
    managerEmail: '',
    managerPhone: '',
    companyName: '',
    
    // Energy Information
    annualEnergyUsage: '1250000',
    currentUtilityRate: '0.310',
    
    // Solar Configuration
    panelCount: '622',
    panelCapacity: '250',
    installationCostPerWatt: '4.00',
    solarIncentives: '7000',
    monthlyAverageBill: '300',
    
    // Roof Information
    roofType: 'flat',
    roofAngle: '0',
    roofOrientation: 'south',
    shadingFactor: '10',
  });

  // Load data from localStorage if available
  useEffect(() => {
    const storedData = localStorage.getItem('facilityData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setFormData(prev => ({
          ...prev,
          ...parsedData
        }));
      } catch (error) {
        console.error('Error parsing stored facility data:', error);
      }
    }
  }, []);

  const industryTypes = [
    'Manufacturing',
    'Warehousing',
    'Food Processing',
    'Pharmaceuticals',
    'Automotive',
    'Electronics',
    'Chemical',
    'Textile',
    'Aerospace',
    'Metal Fabrication',
    'Plastics',
    'Paper & Pulp',
    'Other'
  ];

  const roofTypes = [
    'Flat',
    'Metal',
    'Shingle',
    'Tile',
    'Membrane'
  ];

  const roofOrientations = [
    'North',
    'Northeast',
    'East',
    'Southeast',
    'South',
    'Southwest',
    'West',
    'Northwest'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.facilityName || !formData.address || !formData.city || 
        !formData.state || !formData.zipCode || !formData.squareFootage || 
        !formData.industryType || !formData.managerName || !formData.managerEmail) {
      toast.error('Please fill in all required fields');
      return;
    }

    // In a real app, you would save this data to your backend
    // For now, we'll just store it in localStorage and navigate to the next page
    localStorage.setItem('facilityData', JSON.stringify(formData));
    toast.success('Facility information saved successfully!');
    navigate('/energy-usage');
  };

  // Calculate estimated values based on form data
  const calculateEstimates = () => {
    const squareFootage = parseFloat(formData.squareFootage) || 0;
    const utilityRate = parseFloat(formData.currentUtilityRate) || 0.12;
    const panelCapacity = parseFloat(formData.panelCapacity) || 250;
    const panelCount = parseFloat(formData.panelCount) || 0;
    const installationCostPerWatt = parseFloat(formData.installationCostPerWatt) || 2.5;
    
    // Calculate installation size
    const installationSize = (panelCount * panelCapacity / 1000).toFixed(1);
    
    // Calculate yearly energy production
    const annualSunHours = 1600; // Average annual sun hours
    const solarEfficiencyFactor = 0.18; // 18% efficiency for commercial solar panels
    const yearlyEnergy = panelCount * panelCapacity * annualSunHours * solarEfficiencyFactor / 1000;
    
    // Calculate yearly cost savings
    const yearlyCost = yearlyEnergy * utilityRate;
    
    // Calculate energy covered percentage
    const annualEnergyUsage = parseFloat(formData.annualEnergyUsage) || 0;
    const energyCovered = annualEnergyUsage > 0 ? (yearlyEnergy / annualEnergyUsage) * 100 : 0;
    
    // Calculate monthly average savings
    const monthlyAverage = yearlyCost / 12;
    
    // Calculate installation cost
    const installationCost = panelCount * panelCapacity * installationCostPerWatt;
    
    // Calculate payback period
    const paybackPeriod = yearlyCost > 0 ? installationCost / yearlyCost : 0;
    
    return {
      installationSize: `${installationSize} kW`,
      yearlyEnergy: `${yearlyEnergy.toLocaleString(undefined, {maximumFractionDigits: 1})} kWh`,
      yearlyCost: `$${yearlyCost.toLocaleString(undefined, {maximumFractionDigits: 2})}`,
      energyCovered: `${energyCovered.toLocaleString(undefined, {maximumFractionDigits: 0})}%`,
      monthlyAverage: `$${monthlyAverage.toLocaleString(undefined, {maximumFractionDigits: 2})}`,
      installationCost: `$${installationCost.toLocaleString(undefined, {maximumFractionDigits: 2})}`,
      paybackPeriod: `${paybackPeriod.toLocaleString(undefined, {maximumFractionDigits: 1})} years`
    };
  };

  const estimates = calculateEstimates();

  // Add a solar map preview component
  const SolarMapPreview = () => {
    return (
      <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 h-64">
        <img 
          src="/images/solar/Screenshot.png" 
          alt="Solar potential heat map" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
          <h3 className="text-white font-bold text-lg">Solar Potential Map</h3>
          <p className="text-white text-sm">
            {formData.address}, {formData.city}, {formData.state} {formData.zipCode}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-5">
        <div className="box">
          <div className="flex items-center gap-3 mb-5">
            <MdFactory className="text-2xl" />
            <h2 className="text-xl font-bold">Solar Potential Calculator</h2>
          </div>
          
          <p className="mb-5 text-gray-600 dark:text-gray-300">
            Enter your industrial facility details below to calculate potential solar energy savings and efficiency.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Solar Potential Analysis Summary */}
            <div className="lg:col-span-2 bg-blue-50 dark:bg-slate-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <MdSolarPower className="text-2xl text-blue-600" />
                <h3 className="text-lg font-bold">Solar Potential Analysis</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Yearly Energy</h4>
                  <p className="text-xl font-bold">{estimates.yearlyEnergy}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Yearly Cost Savings</h4>
                  <p className="text-xl font-bold">{estimates.yearlyCost}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Installation Size</h4>
                  <p className="text-xl font-bold">{estimates.installationSize}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Energy Covered</h4>
                  <p className="text-xl font-bold">{estimates.energyCovered}</p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-700 p-3 rounded-md">
                  <h4 className="text-sm font-medium text-gray-500">Monthly Average</h4>
                  <p className="text-xl font-bold text-blue-600">{estimates.monthlyAverage}</p>
                </div>
                <div className="bg-white dark:bg-gray-700 p-3 rounded-md">
                  <h4 className="text-sm font-medium text-gray-500">Installation Cost</h4>
                  <p className="text-xl font-bold">{estimates.installationCost}</p>
                </div>
                <div className="bg-white dark:bg-gray-700 p-3 rounded-md">
                  <h4 className="text-sm font-medium text-gray-500">Payback Period</h4>
                  <p className="text-xl font-bold">{estimates.paybackPeriod}</p>
                </div>
              </div>
            </div>
            
            {/* Location Rates */}
            <div className="bg-green-50 dark:bg-slate-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <MdLocationOn className="text-2xl text-green-600" />
                <h3 className="text-lg font-bold">Location Rates</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">State</h4>
                  <p className="text-lg font-bold">{formData.state}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Zip Code</h4>
                  <p className="text-lg font-bold">{formData.zipCode}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Energy Rate</h4>
                  <p className="text-lg font-bold">${formData.currentUtilityRate}/kWh</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Panel Count</h4>
                  <p className="text-lg font-bold">{formData.panelCount} panels</p>
                </div>
              </div>
            </div>
          </div>

          {/* Solar Map Preview */}
          <div className="mb-6">
            <SolarMapPreview />
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <MdFactory className="text-xl" /> Facility Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Facility Name *</label>
                  <input
                    type="text"
                    name="facilityName"
                    value={formData.facilityName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    placeholder="Enter facility name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Industry Type *</label>
                  <select
                    name="industryType"
                    value={formData.industryType}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    required
                  >
                    <option value="">Select Industry Type</option>
                    {industryTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Square Footage *</label>
                  <input
                    type="number"
                    name="squareFootage"
                    value={formData.squareFootage}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    placeholder="Enter square footage"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Operating Hours (daily)</label>
                  <input
                    type="number"
                    name="operatingHours"
                    value={formData.operatingHours}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    placeholder="Enter operating hours"
                    min="0"
                    max="24"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <MdLocationOn className="text-xl" /> Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    placeholder="Enter street address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    placeholder="Enter city"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    placeholder="Enter state"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ZIP Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    placeholder="Enter ZIP code"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <MdPerson className="text-xl" /> Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Manager Name *</label>
                  <input
                    type="text"
                    name="managerName"
                    value={formData.managerName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    placeholder="Enter manager name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Manager Email *</label>
                  <input
                    type="email"
                    name="managerEmail"
                    value={formData.managerEmail}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    placeholder="Enter manager email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Manager Phone</label>
                  <input
                    type="tel"
                    name="managerPhone"
                    value={formData.managerPhone}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    placeholder="Enter manager phone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    placeholder="Enter company name"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <MdBusiness className="text-xl" /> Energy Information
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Annual Energy Usage (kWh)</label>
                  <input
                    type="number"
                    name="annualEnergyUsage"
                    value={formData.annualEnergyUsage}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    placeholder="Enter annual energy usage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Current Utility Rate ($/kWh)</label>
                  <input
                    type="number"
                    name="currentUtilityRate"
                    value={formData.currentUtilityRate}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    placeholder="Enter current utility rate"
                    step="0.001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Monthly Average Bill ($)</label>
                  <input
                    type="number"
                    name="monthlyAverageBill"
                    value={formData.monthlyAverageBill}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    placeholder="Enter monthly average bill"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <MdSolarPower className="text-xl" /> Solar Configuration
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Panel Count</label>
                  <input
                    type="number"
                    name="panelCount"
                    value={formData.panelCount}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    placeholder="Enter panel count"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Panel Capacity (Watts)</label>
                  <input
                    type="number"
                    name="panelCapacity"
                    value={formData.panelCapacity}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    placeholder="Enter panel capacity"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Installation Cost ($/Watt)</label>
                  <input
                    type="number"
                    name="installationCostPerWatt"
                    value={formData.installationCostPerWatt}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    placeholder="Enter installation cost per watt"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Solar Incentives ($)</label>
                  <input
                    type="number"
                    name="solarIncentives"
                    value={formData.solarIncentives}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    placeholder="Enter solar incentives amount"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <MdOutlineRoofing className="text-xl" /> Roof Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Roof Type</label>
                  <select
                    name="roofType"
                    value={formData.roofType}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                  >
                    <option value="">Select Roof Type</option>
                    {roofTypes.map(type => (
                      <option key={type.toLowerCase()} value={type.toLowerCase()}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Roof Angle (degrees)</label>
                  <input
                    type="number"
                    name="roofAngle"
                    value={formData.roofAngle}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    placeholder="Enter roof angle"
                    min="0"
                    max="90"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Roof Orientation</label>
                  <select
                    name="roofOrientation"
                    value={formData.roofOrientation}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                  >
                    <option value="">Select Orientation</option>
                    {roofOrientations.map(orientation => (
                      <option key={orientation.toLowerCase()} value={orientation.toLowerCase()}>{orientation}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Shading Factor (%)</label>
                  <input
                    type="number"
                    name="shadingFactor"
                    value={formData.shadingFactor}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    placeholder="Enter shading percentage"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-2 mt-4 flex justify-between">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Back to Dashboard
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Continue to Energy Usage
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FacilityCalculator; 