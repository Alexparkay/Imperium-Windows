import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil, HiOutlineTrash, HiPlus, HiXMark } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { MdSolarPower, MdElectricBolt, MdOutlineSettings, MdBolt, MdPower, MdBusiness, MdLocationOn, MdOutlineEmail, MdOutlinePhone, MdSave, MdConstruction, MdBarChart } from 'react-icons/md';

const EditProfile = () => {
  const navigate = useNavigate();

  // Company Info State
  const [companyInfo, setCompanyInfo] = useState({
    name: "Q Solar LLC",
    address: "118 South Montclair Avenue, Glen Ellyn, IL 60137",
    phone: "(630) 555-0123",
    email: "contact@qsolar.com",
    website: "www.qsolar.com"
  });

  // Solar Panels State
  const [panels, setPanels] = useState([
    {
      model: "Q-Solar Premium",
      wattage: 400,
      efficiency: 21.4,
      warranty: 25,
      dimensions: "1755 x 1038 x 35 mm",
      weight: "20.5 kg"
    },
    {
      model: "Q-Solar Elite",
      wattage: 450,
      efficiency: 22.8,
      warranty: 30,
      dimensions: "1855 x 1038 x 35 mm",
      weight: "21.5 kg"
    }
  ]);

  // Inverters State
  const [inverters, setInverters] = useState([
    {
      model: "Q-Power X1",
      capacity: "7.6 kW",
      efficiency: 97.5,
      warranty: 12,
      features: ["Smart monitoring", "Battery ready", "Rapid shutdown"]
    },
    {
      model: "Q-Power X2",
      capacity: "11.4 kW",
      efficiency: 98.2,
      warranty: 15,
      features: ["Smart monitoring", "Battery ready", "Rapid shutdown", "Dual MPPT"]
    }
  ]);

  // Installation Capabilities State
  const [installationCapabilities, setInstallationCapabilities] = useState({
    maxProjectSize: "2 MW",
    typicalProjectSize: "10-250 kW",
    installationTypes: ["Rooftop", "Ground Mount", "Carport"],
    certifications: ["NABCEP", "UL", "IEEE"],
    serviceArea: ["Illinois", "Wisconsin", "Indiana", "Iowa"]
  });

  // Performance Metrics State
  const [performance, setPerformance] = useState({
    completedProjects: 850,
    totalCapacity: "12.5 MW",
    averageEfficiency: 21.6,
    customerSatisfaction: 4.8
  });

  // Handlers for adding/removing items
  const addPanel = () => {
    setPanels([...panels, {
      model: "",
      wattage: 0,
      efficiency: 0,
      warranty: 0,
      dimensions: "",
      weight: ""
    }]);
  };

  const removePanel = (index: number) => {
    setPanels(panels.filter((_, i) => i !== index));
  };

  const addInverter = () => {
    setInverters([...inverters, {
      model: "",
      capacity: "",
      efficiency: 0,
      warranty: 0,
      features: []
    }]);
  };

  const removeInverter = (index: number) => {
    setInverters(inverters.filter((_, i) => i !== index));
  };

  const addFeature = (inverterIndex: number) => {
    const newInverters = [...inverters];
    newInverters[inverterIndex].features.push("");
    setInverters(newInverters);
  };

  const removeFeature = (inverterIndex: number, featureIndex: number) => {
    const newInverters = [...inverters];
    newInverters[inverterIndex].features.splice(featureIndex, 1);
    setInverters(newInverters);
  };

  const addInstallationType = () => {
    setInstallationCapabilities({
      ...installationCapabilities,
      installationTypes: [...installationCapabilities.installationTypes, ""]
    });
  };

  const removeInstallationType = (index: number) => {
    setInstallationCapabilities({
      ...installationCapabilities,
      installationTypes: installationCapabilities.installationTypes.filter((_, i) => i !== index)
    });
  };

  const addCertification = () => {
    setInstallationCapabilities({
      ...installationCapabilities,
      certifications: [...installationCapabilities.certifications, ""]
    });
  };

  const removeCertification = (index: number) => {
    setInstallationCapabilities({
      ...installationCapabilities,
      certifications: installationCapabilities.certifications.filter((_, i) => i !== index)
    });
  };

  const addServiceArea = () => {
    setInstallationCapabilities({
      ...installationCapabilities,
      serviceArea: [...installationCapabilities.serviceArea, ""]
    });
  };

  const removeServiceArea = (index: number) => {
    setInstallationCapabilities({
      ...installationCapabilities,
      serviceArea: installationCapabilities.serviceArea.filter((_, i) => i !== index)
    });
  };

  // Handler for saving changes
  const handleSave = () => {
    // Here you would typically make an API call to save the data
    toast.success('Profile updated successfully!');
    navigate('/profile');
  };

  return (
    <div className="w-full px-1 py-2 bg-[#020305] min-h-screen min-w-full relative">
      {/* Background gradient orbs */}
      <div className="fixed top-20 right-40 w-96 h-96 bg-gradient-to-br from-orange-500/5 to-transparent rounded-full blur-3xl transform rotate-12 opacity-70 pointer-events-none"></div>
      <div className="fixed bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-orange-500/5 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-60 pointer-events-none"></div>

      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">Edit Company Profile</h2>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/profile')}
            className="btn bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/60 to-[rgba(40,41,43,0.4)] text-white border border-orange-500/15 hover:shadow-lg hover:shadow-orange-500/20"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white border-none hover:shadow-lg hover:shadow-orange-500/20 gap-2"
          >
            <MdSave className="text-lg" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Main Content with Centered Image */}
      <div className="relative w-full min-h-[calc(100vh-12rem)] flex items-center justify-center">
        {/* Central Solar Panel Image */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="relative w-[600px] h-[600px]">
            <img 
              src="/images/solar/Solar_panel.png" 
              alt="Solar Panel Diagram" 
              className="w-full h-full object-contain opacity-75"
            />
            {/* Radial gradient overlay */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#020305]/50 to-[#020305] opacity-50"></div>
          </div>
        </div>

        {/* Annotation Layout Container */}
        <div className="relative w-full h-full z-20 grid grid-cols-3 gap-6">
          {/* Top Row */}
          <div className="col-span-1">
            {/* Company Info Card */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-orange-500/15 p-4">
              <div className="flex items-center gap-3 mb-3">
                <MdBusiness className="text-2xl text-orange-500" />
                <h3 className="text-lg font-semibold text-white">Company Info</h3>
              </div>
              <div className="space-y-3">
                <div className="form-control">
                  <input
                    type="text"
                    value={companyInfo.name}
                    onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                    className="input input-sm bg-[#28292b]/40 backdrop-blur-md border-orange-500/20 text-white placeholder-white/40"
                    placeholder="Company Name"
                  />
                </div>
                <div className="form-control">
                  <div className="flex items-center gap-2">
                    <MdLocationOn className="text-orange-400 min-w-[1rem]" />
                    <input
                      type="text"
                      value={companyInfo.address}
                      onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
                      className="input input-sm bg-[#28292b]/40 backdrop-blur-md border-orange-500/20 text-white placeholder-white/40 w-full"
                      placeholder="Address"
                    />
                  </div>
                </div>
                <div className="form-control">
                  <div className="flex items-center gap-2">
                    <MdOutlinePhone className="text-orange-400 min-w-[1rem]" />
                    <input
                      type="text"
                      value={companyInfo.phone}
                      onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
                      className="input input-sm bg-[#28292b]/40 backdrop-blur-md border-orange-500/20 text-white placeholder-white/40 w-full"
                      placeholder="Phone"
                    />
                  </div>
                </div>
                <div className="form-control">
                  <div className="flex items-center gap-2">
                    <MdOutlineEmail className="text-orange-400 min-w-[1rem]" />
                    <input
                      type="email"
                      value={companyInfo.email}
                      onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})}
                      className="input input-sm bg-[#28292b]/40 backdrop-blur-md border-orange-500/20 text-white placeholder-white/40 w-full"
                      placeholder="Email"
                    />
                  </div>
                </div>
                <div className="form-control mt-2">
                  <div className="flex items-start gap-2">
                    <span className="text-white/60 text-sm">Website:</span>
                    <input
                      type="text"
                      value={companyInfo.website}
                      onChange={(e) => setCompanyInfo({...companyInfo, website: e.target.value})}
                      className="input input-sm bg-[#28292b]/40 backdrop-blur-md border-orange-500/20 text-white placeholder-white/40 w-full"
                      placeholder="Website"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Center - Empty for Image */}
          <div className="col-span-1"></div>

          {/* Top Right */}
          <div className="col-span-1">
            {/* Performance Metrics */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-orange-500/15 p-4">
              <div className="flex items-center gap-3 mb-3">
                <MdBolt className="text-2xl text-orange-500" />
                <h3 className="text-lg font-semibold text-white">Performance</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-white/60 text-sm">Projects</p>
                  <input
                    type="number"
                    value={performance.completedProjects}
                    onChange={(e) => setPerformance({...performance, completedProjects: Number(e.target.value)})}
                    className="input input-sm bg-[#28292b]/40 backdrop-blur-md border-orange-500/20 text-white placeholder-white/40 w-full mt-1"
                  />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Total Capacity</p>
                  <input
                    type="text"
                    value={performance.totalCapacity}
                    onChange={(e) => setPerformance({...performance, totalCapacity: e.target.value})}
                    className="input input-sm bg-[#28292b]/40 backdrop-blur-md border-orange-500/20 text-white placeholder-white/40 w-full mt-1"
                  />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Efficiency</p>
                  <input
                    type="number"
                    value={performance.averageEfficiency}
                    onChange={(e) => setPerformance({...performance, averageEfficiency: Number(e.target.value)})}
                    className="input input-sm bg-[#28292b]/40 backdrop-blur-md border-orange-500/20 text-white placeholder-white/40 w-full mt-1"
                    step="0.1"
                  />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Satisfaction</p>
                  <input
                    type="number"
                    value={performance.customerSatisfaction}
                    onChange={(e) => setPerformance({...performance, customerSatisfaction: Number(e.target.value)})}
                    className="input input-sm bg-[#28292b]/40 backdrop-blur-md border-orange-500/20 text-white placeholder-white/40 w-full mt-1"
                    step="0.1"
                    min="0"
                    max="5"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Middle Row - Side Panels */}
          <div className="col-span-1 self-center">
            {/* Solar Panels Info */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-orange-500/15 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <MdSolarPower className="text-2xl text-orange-500" />
                  <h3 className="text-lg font-semibold text-white">Solar Panels</h3>
                </div>
                <button
                  onClick={addPanel}
                  className="btn btn-circle btn-xs bg-gradient-to-br from-orange-500/20 via-orange-600/20 to-amber-600/20 text-orange-400 border border-orange-500/20"
                >
                  <HiPlus className="text-lg" />
                </button>
              </div>
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {panels.map((panel, index) => (
                  <div key={index} className="bg-[#28292b]/40 backdrop-blur-md rounded-lg p-3 border border-orange-500/10 relative">
                    <button
                      onClick={() => removePanel(index)}
                      className="absolute -top-2 -right-2 btn btn-circle btn-xs bg-red-500/20 text-red-400 border border-red-500/20"
                    >
                      <HiXMark />
                    </button>
                    <div className="space-y-2">
                      <div className="font-semibold">
                        <input
                          type="text"
                          value={panel.model}
                          onChange={(e) => {
                            const newPanels = [...panels];
                            newPanels[index].model = e.target.value;
                            setPanels(newPanels);
                          }}
                          className="input input-sm w-full bg-[#28292b]/40 backdrop-blur-md border-orange-500/20 text-white placeholder-white/40"
                          placeholder="Model name"
                        />
                      </div>
                      <div className="flex items-center">
                        <span className="text-white/60 text-sm w-24">Wattage:</span>
                        <input
                          type="number"
                          value={panel.wattage}
                          onChange={(e) => {
                            const newPanels = [...panels];
                            newPanels[index].wattage = Number(e.target.value);
                            setPanels(newPanels);
                          }}
                          className="input input-sm bg-[#28292b]/40 backdrop-blur-md border-orange-500/20 text-white placeholder-white/40 w-full"
                          placeholder="Wattage (W)"
                        />
                      </div>
                      <div className="flex items-center">
                        <span className="text-white/60 text-sm w-24">Efficiency:</span>
                        <input
                          type="number"
                          value={panel.efficiency}
                          onChange={(e) => {
                            const newPanels = [...panels];
                            newPanels[index].efficiency = Number(e.target.value);
                            setPanels(newPanels);
                          }}
                          className="input input-sm bg-[#28292b]/40 backdrop-blur-md border-orange-500/20 text-white placeholder-white/40 w-full"
                          placeholder="Efficiency (%)"
                          step="0.1"
                        />
                      </div>
                      <div className="flex items-center">
                        <span className="text-white/60 text-sm w-24">Warranty:</span>
                        <input
                          type="number"
                          value={panel.warranty}
                          onChange={(e) => {
                            const newPanels = [...panels];
                            newPanels[index].warranty = Number(e.target.value);
                            setPanels(newPanels);
                          }}
                          className="input input-sm bg-[#28292b]/40 backdrop-blur-md border-orange-500/20 text-white placeholder-white/40 w-full"
                          placeholder="Warranty (years)"
                        />
                      </div>
                      <div className="flex items-center">
                        <span className="text-white/60 text-sm w-24">Dimensions:</span>
                        <input
                          type="text"
                          value={panel.dimensions}
                          onChange={(e) => {
                            const newPanels = [...panels];
                            newPanels[index].dimensions = e.target.value;
                            setPanels(newPanels);
                          }}
                          className="input input-sm bg-[#28292b]/40 backdrop-blur-md border-orange-500/20 text-white placeholder-white/40 w-full"
                          placeholder="Dimensions"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Center - Empty for Image */}
          <div className="col-span-1"></div>

          {/* Middle Right */}
          <div className="col-span-1 self-center">
            {/* Inverters Info */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-orange-500/15 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <MdPower className="text-2xl text-orange-500" />
                  <h3 className="text-lg font-semibold text-white">Inverters</h3>
                </div>
                <button
                  onClick={addInverter}
                  className="btn btn-circle btn-xs bg-gradient-to-br from-orange-500/20 via-orange-600/20 to-amber-600/20 text-orange-400 border border-orange-500/20"
                >
                  <HiPlus className="text-lg" />
                </button>
              </div>
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {inverters.map((inverter, index) => (
                  <div key={index} className="bg-[#28292b]/40 backdrop-blur-md rounded-lg p-3 border border-orange-500/10 relative">
                    <button
                      onClick={() => removeInverter(index)}
                      className="absolute -top-2 -right-2 btn btn-circle btn-xs bg-red-500/20 text-red-400 border border-red-500/20"
                    >
                      <HiXMark />
                    </button>
                    <div className="space-y-2">
                      <div className="font-semibold">
                        <input
                          type="text"
                          value={inverter.model}
                          onChange={(e) => {
                            const newInverters = [...inverters];
                            newInverters[index].model = e.target.value;
                            setInverters(newInverters);
                          }}
                          className="input input-sm w-full bg-[#28292b]/40 backdrop-blur-md border-orange-500/20 text-white placeholder-white/40"
                          placeholder="Model name"
                        />
                      </div>
                      <div className="flex items-center">
                        <span className="text-white/60 text-sm w-24">Capacity:</span>
                        <input
                          type="text"
                          value={inverter.capacity}
                          onChange={(e) => {
                            const newInverters = [...inverters];
                            newInverters[index].capacity = e.target.value;
                            setInverters(newInverters);
                          }}
                          className="input input-sm bg-[#28292b]/40 backdrop-blur-md border-orange-500/20 text-white placeholder-white/40 w-full"
                          placeholder="Capacity"
                        />
                      </div>
                      <div className="flex items-center">
                        <span className="text-white/60 text-sm w-24">Efficiency:</span>
                        <input
                          type="number"
                          value={inverter.efficiency}
                          onChange={(e) => {
                            const newInverters = [...inverters];
                            newInverters[index].efficiency = Number(e.target.value);
                            setInverters(newInverters);
                          }}
                          className="input input-sm bg-[#28292b]/40 backdrop-blur-md border-orange-500/20 text-white placeholder-white/40 w-full"
                          placeholder="Efficiency (%)"
                          step="0.1"
                        />
                      </div>
                      <div className="flex items-center">
                        <span className="text-white/60 text-sm w-24">Warranty:</span>
                        <input
                          type="number"
                          value={inverter.warranty}
                          onChange={(e) => {
                            const newInverters = [...inverters];
                            newInverters[index].warranty = Number(e.target.value);
                            setInverters(newInverters);
                          }}
                          className="input input-sm bg-[#28292b]/40 backdrop-blur-md border-orange-500/20 text-white placeholder-white/40 w-full"
                          placeholder="Warranty (years)"
                        />
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white/60 text-sm">Features:</span>
                          <button
                            onClick={() => addFeature(index)}
                            className="btn btn-xs bg-gradient-to-br from-orange-500/20 via-orange-600/20 to-amber-600/20 text-orange-400 border border-orange-500/20"
                          >
                            <HiPlus className="text-sm" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {inverter.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center gap-1 bg-orange-500/10 rounded border border-orange-500/20 pl-2 pr-1 py-1">
                              <input
                                type="text"
                                value={feature}
                                onChange={(e) => {
                                  const newInverters = [...inverters];
                                  newInverters[index].features[featureIndex] = e.target.value;
                                  setInverters(newInverters);
                                }}
                                className="bg-transparent border-none text-orange-300 text-xs w-24 focus:outline-none"
                                placeholder="Feature"
                              />
                              <button
                                onClick={() => removeFeature(index, featureIndex)}
                                className="text-orange-300/60 hover:text-orange-300"
                              >
                                <HiXMark className="text-xs" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="col-span-1">
            {/* Installation Types */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-orange-500/15 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <MdOutlineSettings className="text-2xl text-orange-500" />
                  <h3 className="text-lg font-semibold text-white">Installation</h3>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Project Sizes</h4>
                  <div className="text-sm space-y-2">
                    <div className="flex items-center">
                      <span className="text-white/60 w-28">Maximum:</span>
                      <input
                        type="text"
                        value={installationCapabilities.maxProjectSize}
                        onChange={(e) => setInstallationCapabilities({
                          ...installationCapabilities,
                          maxProjectSize: e.target.value
                        })}
                        className="input input-sm bg-[#28292b]/40 backdrop-blur-md border-orange-500/20 text-white placeholder-white/40 w-full"
                        placeholder="Max Size"
                      />
                    </div>
                    <div className="flex items-center">
                      <span className="text-white/60 w-28">Typical Range:</span>
                      <input
                        type="text"
                        value={installationCapabilities.typicalProjectSize}
                        onChange={(e) => setInstallationCapabilities({
                          ...installationCapabilities,
                          typicalProjectSize: e.target.value
                        })}
                        className="input input-sm bg-[#28292b]/40 backdrop-blur-md border-orange-500/20 text-white placeholder-white/40 w-full"
                        placeholder="Typical Range"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-white">Installation Types</h4>
                    <button
                      onClick={addInstallationType}
                      className="btn btn-xs bg-gradient-to-br from-orange-500/20 via-orange-600/20 to-amber-600/20 text-orange-400 border border-orange-500/20"
                    >
                      <HiPlus className="text-sm" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {installationCapabilities.installationTypes.map((type, index) => (
                      <div key={index} className="flex items-center gap-1 bg-orange-500/10 rounded border border-orange-500/20 pl-2 pr-1 py-1">
                        <input
                          type="text"
                          value={type}
                          onChange={(e) => {
                            const newTypes = [...installationCapabilities.installationTypes];
                            newTypes[index] = e.target.value;
                            setInstallationCapabilities({
                              ...installationCapabilities,
                              installationTypes: newTypes
                            });
                          }}
                          className="bg-transparent border-none text-orange-300 text-xs w-24 focus:outline-none"
                          placeholder="Type"
                        />
                        <button
                          onClick={() => removeInstallationType(index)}
                          className="text-orange-300/60 hover:text-orange-300"
                        >
                          <HiXMark className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Center - Empty for Image */}
          <div className="col-span-1"></div>

          {/* Bottom Right */}
          <div className="col-span-1">
            {/* Certifications and Service Area */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-orange-500/15 p-4">
              <div className="flex items-center gap-3 mb-3">
                <MdElectricBolt className="text-2xl text-orange-500" />
                <h3 className="text-lg font-semibold text-white">Certifications & Coverage</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-white">Certifications</h4>
                    <button
                      onClick={addCertification}
                      className="btn btn-xs bg-gradient-to-br from-orange-500/20 via-orange-600/20 to-amber-600/20 text-orange-400 border border-orange-500/20"
                    >
                      <HiPlus className="text-sm" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {installationCapabilities.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-1 bg-orange-500/10 rounded border border-orange-500/20 pl-2 pr-1 py-1">
                        <input
                          type="text"
                          value={cert}
                          onChange={(e) => {
                            const newCerts = [...installationCapabilities.certifications];
                            newCerts[index] = e.target.value;
                            setInstallationCapabilities({
                              ...installationCapabilities,
                              certifications: newCerts
                            });
                          }}
                          className="bg-transparent border-none text-orange-300 text-xs w-16 focus:outline-none"
                          placeholder="Cert"
                        />
                        <button
                          onClick={() => removeCertification(index)}
                          className="text-orange-300/60 hover:text-orange-300"
                        >
                          <HiXMark className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-white">Service Area</h4>
                    <button
                      onClick={addServiceArea}
                      className="btn btn-xs bg-gradient-to-br from-orange-500/20 via-orange-600/20 to-amber-600/20 text-orange-400 border border-orange-500/20"
                    >
                      <HiPlus className="text-sm" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {installationCapabilities.serviceArea.map((area, index) => (
                      <div key={index} className="flex items-center gap-1 bg-orange-500/10 rounded border border-orange-500/20 pl-2 pr-1 py-1">
                        <input
                          type="text"
                          value={area}
                          onChange={(e) => {
                            const newAreas = [...installationCapabilities.serviceArea];
                            newAreas[index] = e.target.value;
                            setInstallationCapabilities({
                              ...installationCapabilities,
                              serviceArea: newAreas
                            });
                          }}
                          className="bg-transparent border-none text-orange-300 text-xs w-20 focus:outline-none"
                          placeholder="Area"
                        />
                        <button
                          onClick={() => removeServiceArea(index)}
                          className="text-orange-300/60 hover:text-orange-300"
                        >
                          <HiXMark className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
