import React from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { MdSolarPower, MdElectricBolt, MdOutlineSettings, MdBolt, MdPower, MdBusiness, MdLocationOn, MdOutlineEmail, MdOutlinePhone } from 'react-icons/md';

const Profile = () => {
  const modalDelete = React.useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();

  // Sample company solar data
  const solarCompanyData = {
    companyInfo: {
      name: "Q Solar LLC",
      address: "118 South Montclair Avenue, Glen Ellyn, IL 60137",
      phone: "(630) 555-0123",
      email: "contact@qsolar.com",
      website: "www.qsolar.com"
    },
    solarProducts: {
      panels: [
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
      ],
      inverters: [
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
      ]
    },
    installationCapabilities: {
      maxProjectSize: "2 MW",
      typicalProjectSize: "10-250 kW",
      installationTypes: ["Rooftop", "Ground Mount", "Carport"],
      certifications: ["NABCEP", "UL", "IEEE"],
      serviceArea: ["Illinois", "Wisconsin", "Indiana", "Iowa"]
    },
    performance: {
      completedProjects: 850,
      totalCapacity: "12.5 MW",
      averageEfficiency: 21.6,
      customerSatisfaction: 4.8
    }
  };

  // Function to generate random gradient patterns
  const getRandomGradient = () => {
    const patterns = [
      {
        base: "bg-gradient-to-tr from-orange-500/30 via-amber-500/20 to-orange-600/15",
        blobs: [
          "absolute -top-20 left-1/4 w-40 h-40 bg-gradient-to-br from-orange-500/40",
          "absolute bottom-1/3 -right-10 w-32 h-32 bg-gradient-to-tl from-amber-500/30",
          "absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-orange-600/25"
        ]
      },
      {
        base: "bg-gradient-to-bl from-orange-600/30 via-amber-600/20 to-orange-500/15",
        blobs: [
          "absolute top-1/3 -left-16 w-48 h-48 bg-gradient-to-tr from-orange-500/40",
          "absolute -bottom-10 right-1/4 w-36 h-36 bg-gradient-to-bl from-amber-500/35",
          "absolute top-1/4 right-1/3 w-28 h-28 bg-gradient-to-tr from-orange-600/30"
        ]
      },
      {
        base: "bg-gradient-to-r from-orange-500/30 via-amber-500/20 to-orange-600/25",
        blobs: [
          "absolute -top-10 right-1/3 w-44 h-44 bg-gradient-to-bl from-orange-500/45",
          "absolute bottom-1/4 -left-12 w-40 h-40 bg-gradient-to-tr from-amber-600/40",
          "absolute top-2/3 right-1/4 w-32 h-32 bg-gradient-to-bl from-orange-500/35"
        ]
      }
    ];
    return patterns[Math.floor(Math.random() * patterns.length)];
  };

  return (
    <div className="w-full px-1 py-2 bg-[#020305] min-h-screen min-w-full relative">
      {/* Background gradient orbs */}
      <div className="fixed top-20 right-40 w-96 h-96 bg-gradient-to-br from-orange-500/5 to-transparent rounded-full blur-3xl transform rotate-12 opacity-70 pointer-events-none"></div>
      <div className="fixed bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-orange-500/5 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-60 pointer-events-none"></div>

      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">Company Profile</h2>
        <button
          onClick={() => navigate('/profile/edit')}
          className="btn bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white border-none hover:shadow-lg hover:shadow-orange-500/20"
        >
          <HiOutlinePencil className="text-lg" /> Edit Profile
        </button>
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
                <h3 className="text-lg font-semibold text-white">{solarCompanyData.companyInfo.name}</h3>
              </div>
              <div className="text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <MdLocationOn className="text-orange-400" />
                  <span className="text-white/80">{solarCompanyData.companyInfo.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MdOutlinePhone className="text-orange-400" />
                  <span className="text-white/80">{solarCompanyData.companyInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MdOutlineEmail className="text-orange-400" />
                  <span className="text-white/80">{solarCompanyData.companyInfo.email}</span>
                </div>
                <div className="text-white/80 mt-2">
                  <span className="text-white/60">Website:</span>
                  <span className="ml-2">{solarCompanyData.companyInfo.website}</span>
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
                  <p className="text-xl font-bold text-white">{solarCompanyData.performance.completedProjects}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Total Capacity</p>
                  <p className="text-xl font-bold text-white">{solarCompanyData.performance.totalCapacity}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Efficiency</p>
                  <p className="text-xl font-bold text-white">{solarCompanyData.performance.averageEfficiency}%</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Satisfaction</p>
                  <p className="text-xl font-bold text-white">{solarCompanyData.performance.customerSatisfaction}/5.0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Row - Side Panels */}
          <div className="col-span-1 self-center">
            {/* Solar Panels Info */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-orange-500/15 p-4">
              <div className="flex items-center gap-3 mb-3">
                <MdSolarPower className="text-2xl text-orange-500" />
                <h3 className="text-lg font-semibold text-white">Solar Panels</h3>
              </div>
              {solarCompanyData.solarProducts.panels.map((panel, index) => (
                <div key={index} className="text-sm space-y-2 mb-4 last:mb-0 bg-[#28292b]/40 backdrop-blur-md rounded-lg p-3 border border-orange-500/10">
                  <div className="font-semibold text-white">{panel.model}</div>
                  <div>
                    <span className="text-white/60">Wattage:</span>
                    <span className="ml-2 text-white">{panel.wattage}W</span>
                  </div>
                  <div>
                    <span className="text-white/60">Efficiency:</span>
                    <span className="ml-2 text-white">{panel.efficiency}%</span>
                  </div>
                  <div>
                    <span className="text-white/60">Warranty:</span>
                    <span className="ml-2 text-white">{panel.warranty} years</span>
                  </div>
                  <div>
                    <span className="text-white/60">Dimensions:</span>
                    <span className="ml-2 text-white">{panel.dimensions}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Middle Center - Empty for Image */}
          <div className="col-span-1"></div>

          {/* Middle Right */}
          <div className="col-span-1 self-center">
            {/* Inverters Info */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-orange-500/15 p-4">
              <div className="flex items-center gap-3 mb-3">
                <MdPower className="text-2xl text-orange-500" />
                <h3 className="text-lg font-semibold text-white">Inverters</h3>
              </div>
              {solarCompanyData.solarProducts.inverters.map((inverter, index) => (
                <div key={index} className="text-sm space-y-2 mb-4 last:mb-0 bg-[#28292b]/40 backdrop-blur-md rounded-lg p-3 border border-orange-500/10">
                  <div className="font-semibold text-white">{inverter.model}</div>
                  <div>
                    <span className="text-white/60">Capacity:</span>
                    <span className="ml-2 text-white">{inverter.capacity}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Efficiency:</span>
                    <span className="ml-2 text-white">{inverter.efficiency}%</span>
                  </div>
                  <div>
                    <span className="text-white/60">Warranty:</span>
                    <span className="ml-2 text-white">{inverter.warranty} years</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-white/60">Features:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {inverter.features.map((feature, i) => (
                        <span key={i} className="px-2 py-1 bg-orange-500/10 text-orange-300 rounded-sm text-xs border border-orange-500/20">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row */}
          <div className="col-span-1">
            {/* Installation Types */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-orange-500/15 p-4">
              <div className="flex items-center gap-3 mb-3">
                <MdOutlineSettings className="text-2xl text-orange-500" />
                <h3 className="text-lg font-semibold text-white">Installation</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Project Sizes</h4>
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="text-white/60">Maximum:</span>
                      <span className="ml-2 text-white">{solarCompanyData.installationCapabilities.maxProjectSize}</span>
                    </div>
                    <div>
                      <span className="text-white/60">Typical Range:</span>
                      <span className="ml-2 text-white">{solarCompanyData.installationCapabilities.typicalProjectSize}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Installation Types</h4>
                  <div className="flex flex-wrap gap-2">
                    {solarCompanyData.installationCapabilities.installationTypes.map((type, index) => (
                      <span key={index} className="px-2 py-1 bg-orange-500/10 text-orange-300 rounded text-xs border border-orange-500/20">
                        {type}
                      </span>
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
                  <h4 className="text-sm font-semibold text-white mb-2">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {solarCompanyData.installationCapabilities.certifications.map((cert, index) => (
                      <span key={index} className="px-2 py-1 bg-orange-500/10 text-orange-300 rounded text-xs border border-orange-500/20">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Service Area</h4>
                  <div className="flex flex-wrap gap-2">
                    {solarCompanyData.installationCapabilities.serviceArea.map((area, index) => (
                      <span key={index} className="px-2 py-1 bg-orange-500/10 text-orange-300 rounded text-xs border border-orange-500/20">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone - Moved to bottom */}
      <div className="mt-8">
        <button
          className="btn bg-gradient-to-br from-red-500/80 via-red-600/80 to-red-700/80 text-white border-none hover:shadow-lg hover:shadow-red-500/20"
          onClick={() => modalDelete.current?.showModal()}
        >
          <HiOutlineTrash className="text-lg" />
          Delete Company Profile
        </button>
        <dialog
          id="modal_delete"
          className="modal"
          ref={modalDelete}
        >
          <div className="modal-box bg-[#28292b] border border-orange-500/15 backdrop-blur-xl">
            <h3 className="font-bold text-xl text-white bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
              Delete Confirmation
            </h3>
            <p className="py-4 text-white/80">
              Are you sure you want to delete your company profile? This action cannot be undone.
            </p>
            <div className="modal-action mx-0 flex-col items-stretch justify-stretch gap-3">
              <button
                onClick={() =>
                  toast('Profile deletion is disabled in demo mode', {
                    icon: '⚠️',
                  })
                }
                className="btn bg-gradient-to-br from-red-500/80 via-red-600/80 to-red-700/80 text-white border-none hover:shadow-lg hover:shadow-red-500/20"
              >
                Yes, delete my profile
              </button>
              <form method="dialog" className="m-0 w-full">
                <button className="btn bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/60 to-[rgba(40,41,43,0.4)] text-white border border-orange-500/15 hover:shadow-lg hover:shadow-orange-500/20 w-full">
                  No, keep my profile
                </button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default Profile;
