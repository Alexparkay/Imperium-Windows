import React from 'react';
import { useState } from 'react';
import TopDealsBox from '../components/topDealsBox/TopDealsBox';
import ChartBox from '../components/charts/ChartBox';
import USMap from '../components/maps/USMap';
import { useQuery } from '@tanstack/react-query';
import {
  MdFactory,
  MdSolarPower,
  MdElectricBolt,
  MdAttachMoney,
  MdLocationOn,
  MdBarChart,
  MdOutlineRoofing,
  MdOutlineWbSunny,
  MdOutlineEmail,
  MdOutlineTrackChanges,
  MdArrowForward,
  MdArrowOutward,
  MdOutlineSettings,
  MdPieChart,
  MdInsights,
  MdOutlineAnalytics,
  MdOutlineLightbulb,
  MdOutlineEnergySavingsLeaf,
  MdCheck,
  MdChevronRight,
  MdOutlineArrowUpward,
  MdTrendingUp,
  MdAccessTime,
  MdOutlineCalendarMonth,
  MdOutlineSearch,
  MdOutlineLocationOn,
  MdOutlineCloud,
  MdOutlineWbSunny as MdSun,
  MdKeyboardArrowRight,
  MdHomeWork,
  MdShowChart,
  MdEmail,
  MdDashboard
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// Mock data for Imperum Solis dashboard
const dashboardData = {
  facilitiesScraped: {
    total: 124,
    enriched: 98,
    percentage: 79,
    chartData: [
      { name: "Jan", value: 45 },
      { name: "Feb", value: 55 },
      { name: "Mar", value: 65 },
      { name: "Apr", value: 75 },
      { name: "May", value: 85 },
      { name: "Jun", value: 95 },
      { name: "Jul", value: 110 },
      { name: "Aug", value: 124 }
    ]
  },
  facilitiesAnalyzed: {
    total: 98,
    percentage: 79,
    chartData: [
      { name: "Jan", value: 35 },
      { name: "Feb", value: 42 },
      { name: "Mar", value: 50 },
      { name: "Apr", value: 58 },
      { name: "May", value: 67 },
      { name: "Jun", value: 78 },
      { name: "Jul", value: 88 },
      { name: "Aug", value: 98 }
    ]
  },
  energyEstimations: {
    total: 98,
    averageUsage: "3,250,000 kWh",
    averageCost: "$390,000",
    chartData: [
      { name: "Jan", value: 2800000 },
      { name: "Feb", value: 2900000 },
      { name: "Mar", value: 3100000 },
      { name: "Apr", value: 3300000 },
      { name: "May", value: 3500000 },
      { name: "Jun", value: 3700000 },
      { name: "Jul", value: 3600000 },
      { name: "Aug", value: 3400000 }
    ]
  },
  solarPotential: {
    facilitiesCalculated: 92,
    averageROI: "185%",
    averagePayback: "7.8 years",
    totalSavings: "$18.5M",
    chartData: [
      { name: "Jan", value: 150 },
      { name: "Feb", value: 160 },
      { name: "Mar", value: 170 },
      { name: "Apr", value: 180 },
      { name: "May", value: 190 },
      { name: "Jun", value: 200 },
      { name: "Jul", value: 190 },
      { name: "Aug", value: 185 }
    ]
  },
  emailCampaigns: {
    emailsSent: 85,
    emailsOpened: 62,
    openRate: 73,
    repliedRate: 42,
    interestedRate: 28,
    chartData: [
      { name: "Sent", value: 85 },
      { name: "Opened", value: 62 },
      { name: "Replied", value: 36 },
      { name: "Interested", value: 24 }
    ]
  },
  topFacilities: [
    {
      id: 1,
      name: "Apple Distribution Center",
      location: "Atlanta, GA",
      savings: "$273,000",
      roi: "205.3%",
      status: "Interested"
    },
    {
      id: 2,
      name: "Tesla Gigafactory",
      location: "Reno, NV",
      savings: "$1,250,000",
      roi: "245.8%",
      status: "Email Sent"
    },
    {
      id: 3,
      name: "Amazon Fulfillment Center",
      location: "Dallas, TX",
      savings: "$425,000",
      roi: "198.2%",
      status: "Follow-up Scheduled"
    },
    {
      id: 4,
      name: "Honeywell Manufacturing Plant",
      location: "Kansas City, MO",
      savings: "$166,320",
      roi: "156.2%",
      status: "Email Opened"
    },
    {
      id: 5,
      name: "Walmart Distribution Center",
      location: "Chicago, IL",
      savings: "$580,000",
      roi: "212.5%",
      status: "Not Contacted"
    }
  ]
};

// Add this mock data for the campaign performance
const campaignData = [
  { date: '01 Mar', sent: 1250, totalOpens: 875, uniqueOpens: 625, replies: 245 },
  { date: '03 Mar', sent: 1450, totalOpens: 1015, uniqueOpens: 725, replies: 285 },
  { date: '05 Mar', sent: 1680, totalOpens: 1175, uniqueOpens: 840, replies: 340 },
  { date: '07 Mar', sent: 1920, totalOpens: 1345, uniqueOpens: 960, replies: 390 },
  { date: '09 Mar', sent: 2240, totalOpens: 1570, uniqueOpens: 1120, replies: 448 },
  { date: '11 Mar', sent: 2580, totalOpens: 1805, uniqueOpens: 1290, replies: 515 },
  { date: '13 Mar', sent: 2950, totalOpens: 2065, uniqueOpens: 1475, replies: 590 },
  { date: '15 Mar', sent: 3280, totalOpens: 2295, uniqueOpens: 1640, replies: 655 },
  { date: '17 Mar', sent: 3650, totalOpens: 2555, uniqueOpens: 1825, replies: 730 },
  { date: '19 Mar', sent: 4120, totalOpens: 2885, uniqueOpens: 2060, replies: 825 },
  { date: '21 Mar', sent: 4580, totalOpens: 3205, uniqueOpens: 2290, replies: 915 },
  { date: '23 Mar', sent: 4980, totalOpens: 3485, uniqueOpens: 2490, replies: 995 },
  { date: '25 Mar', sent: 5320, totalOpens: 3725, uniqueOpens: 2660, replies: 1065 },
  { date: '27 Mar', sent: 5720, totalOpens: 4005, uniqueOpens: 2860, replies: 1145 },
  { date: '29 Mar', sent: 6280, totalOpens: 4395, uniqueOpens: 3140, replies: 1255 },
];

const Home = () => {
  const navigate = useNavigate();

  const FeatureCard = ({ 
    icon, 
    title, 
    description,
    bgColor = 'bg-white dark:bg-slate-800'
  }: { 
    icon: React.ReactNode; 
    title: string; 
    description: string;
    bgColor?: string;
  }) => {
    return (
      <div className={`${bgColor} rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 relative overflow-hidden group border border-slate-100 dark:border-slate-700`}>
        {/* Decorative corner shape */}
        <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-emerald-500/10"></div>
        
        <div className="relative z-10">
          <div className="rounded-2xl bg-gradient-to-tr from-emerald-500 to-emerald-400 p-4 mb-5 text-white shadow-sm inline-flex items-center justify-center">
            <span className="text-2xl">{icon}</span>
          </div>
          
          <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">{title}</h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">{description}</p>
          
          <div className="flex items-center mt-2 group-hover:translate-x-1 transition-transform duration-300">
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center mr-2">
              <MdChevronRight className="text-white text-sm" />
            </div>
            <span className="text-emerald-500 text-sm font-medium">Learn more</span>
          </div>
        </div>
      </div>
    );
  };

  const StatsCard = ({ 
    title, 
    value, 
    change, 
    icon, 
    colorClass,
    borderColor = 'border-white/10' 
  }: { 
    title: string; 
    value: string; 
    change?: string;
    icon: React.ReactNode;
    colorClass: string;
    borderColor?: string;
  }) => {
    return (
      <div className={`backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/40 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 border border-emerald-500/20 hover:-translate-y-1 relative overflow-hidden group`}>
        {/* Enhanced gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 via-purple-500/20 to-blue-500/30 opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-emerald-500/40 to-transparent rounded-full blur-2xl transform rotate-12 opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-tr from-blue-500/30 to-transparent rounded-full blur-xl transform -rotate-12 opacity-80 group-hover:opacity-90"></div>
        <div className="absolute top-1/3 -right-8 w-20 h-20 bg-gradient-to-bl from-purple-500/30 to-transparent rounded-full blur-lg transform rotate-45 opacity-70"></div>
        
        <div className="relative z-10 p-6 bg-gradient-to-br from-white/[0.07] to-white/[0.02] rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-white/90 mb-1">{title}</p>
              <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">{value}</h3>
              {change && (
                <div className="flex items-center text-xs font-medium text-emerald-300 mt-2">
                  <MdTrendingUp className="mr-1" /> {change}
                </div>
              )}
            </div>
            <div className={`rounded-2xl p-3 ${colorClass} shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300 backdrop-blur-md border border-white/20`}>
              {icon}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const WorkflowCard = ({ 
    number, 
    title, 
    description, 
    icon, 
    route, 
    stats,
    chartData,
    chartType = 'bar' // 'bar', 'progress', 'metric', 'sparkline'
  }: { 
    number: number; 
    title: string; 
    description: string; 
    icon: React.ReactNode; 
    route: string;
    stats: React.ReactNode;
    chartData: { name: string; value: number }[];
    chartType?: 'bar' | 'progress' | 'metric' | 'sparkline';
  }) => {
    const renderChart = () => {
      switch (chartType) {
        case 'progress':
          const total = chartData.reduce((sum, item) => sum + item.value, 0);
          return (
            <div className="space-y-3">
              {chartData.map((item, index) => {
                const percentage = (item.value / total) * 100;
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">{item.name}</span>
                      <span className="text-sm font-medium text-white">{item.value}</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          );

        case 'metric':
          return (
            <div className="h-full flex items-center justify-center">
              <div className="bg-slate-800/50 backdrop-blur-md rounded-full h-28 w-28 flex items-center justify-center relative border border-emerald-500/20">
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div 
                    className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all duration-300"
                    style={{ height: `${(chartData[0].value / (chartData[0].value + chartData[1].value)) * 100}%` }}
                  />
                </div>
                <div className="z-10 text-center">
                  <div className="text-2xl font-bold text-white">{chartData[0].value}</div>
                  <div className="text-xs text-slate-300">{chartData[0].name}</div>
                </div>
              </div>
            </div>
          );

        case 'sparkline':
          const maxValue = Math.max(...chartData.map(item => item.value));
          const values = chartData.map(item => item.value / maxValue * 40);
          
          return (
            <div className="h-full flex items-end justify-between px-2">
              {values.map((value, index) => (
                <div 
                  key={index} 
                  className="w-2 bg-gradient-to-t from-emerald-600 to-emerald-500 rounded-t-sm transition-all duration-300 hover:bg-emerald-400"
                  style={{ height: `${value}px` }}
                />
              ))}
            </div>
          );

        default:
          return (
            <div className="h-full flex items-end justify-between px-2">
              {chartData.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-6 bg-gradient-to-t from-emerald-600 to-emerald-500 rounded-t-sm transition-all duration-300 hover:bg-emerald-400"
                    style={{ height: `${(item.value / Math.max(...chartData.map(d => d.value))) * 100}px` }}
                  />
                  <span className="text-xs text-slate-300 mt-1">{item.name}</span>
                </div>
              ))}
            </div>
          );
      }
    };

    // Add a function to generate random gradient patterns
    const getRandomGradient = () => {
      const patterns = [
        {
          base: "bg-gradient-to-tr from-emerald-500/30 via-emerald-500/20 to-emerald-600/15",
          blobs: [
            "absolute -top-20 left-1/4 w-40 h-40 bg-gradient-to-br from-emerald-500/40",
            "absolute bottom-1/3 -right-10 w-32 h-32 bg-gradient-to-tl from-emerald-500/30",
            "absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-emerald-600/25"
          ]
        },
        {
          base: "bg-gradient-to-bl from-emerald-600/30 via-emerald-600/20 to-emerald-500/15",
          blobs: [
            "absolute top-1/3 -left-16 w-48 h-48 bg-gradient-to-tr from-emerald-500/40",
            "absolute -bottom-10 right-1/4 w-36 h-36 bg-gradient-to-bl from-emerald-500/35",
            "absolute top-1/4 right-1/3 w-28 h-28 bg-gradient-to-tr from-emerald-600/30"
          ]
        },
        {
          base: "bg-gradient-to-r from-emerald-500/30 via-emerald-500/20 to-emerald-600/25",
          blobs: [
            "absolute -top-10 right-1/3 w-44 h-44 bg-gradient-to-bl from-emerald-500/45",
            "absolute bottom-1/4 -left-12 w-40 h-40 bg-gradient-to-tr from-emerald-600/40",
            "absolute top-2/3 right-1/4 w-32 h-32 bg-gradient-to-bl from-emerald-500/35"
          ]
        }
      ];
      return patterns[Math.floor(Math.random() * patterns.length)];
    };

    const gradient = getRandomGradient();

    return (
      <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-300 hover:-translate-y-1 border border-emerald-500/15 group relative">
        {/* Random gradient pattern */}
        <div className={`absolute inset-0 ${gradient.base} opacity-25 group-hover:opacity-30`}></div>
        {gradient.blobs.map((blob, index) => (
          <div key={index} className={`${blob} to-transparent rounded-full blur-${index === 0 ? '3xl' : index === 1 ? '2xl' : 'xl'} transform rotate-${Math.floor(Math.random() * 90)}deg`}></div>
        ))}
        
        <div className="p-6 relative z-10 bg-gradient-to-br from-white/[0.06] to-transparent rounded-2xl">
          <div className="flex items-center gap-4 mb-5">
            <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-600 text-white rounded-xl w-10 h-10 flex items-center justify-center text-lg font-bold shrink-0 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300 backdrop-blur-md border border-white/20">
              {number}
            </div>
            <h2 className="text-lg font-bold text-white bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">{title}</h2>
          </div>
          
          <div className="flex items-center gap-3 mb-5">
            <div className="text-emerald-300 text-xl">
              {icon}
            </div>
            <p className="text-white/80 text-sm">{description}</p>
          </div>
          
          {/* Chart Visualization */}
          <div className="h-32 mb-5 px-2 bg-gradient-to-b from-white/[0.05] to-transparent rounded-xl p-4">
            {renderChart()}
          </div>
          
          <div className="bg-gradient-to-br from-[#28292b]/60 to-[rgba(40,41,43,0.2)] backdrop-blur-md rounded-xl p-4 mb-5 shadow-sm border border-emerald-500/20 relative overflow-hidden">
            {/* Inner gradient effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-purple-500/5 to-blue-500/10 opacity-30"></div>
            <div className="relative z-10">
              {stats}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={() => navigate(route)}
              className="text-sm text-emerald-300 hover:text-emerald-200 transition-colors flex items-center gap-1 group font-medium"
            >
              View Details
              <MdArrowForward className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-screen bg-[#020305] relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="fixed top-20 right-40 w-96 h-96 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full blur-3xl transform rotate-12 opacity-70 pointer-events-none"></div>
      <div className="fixed bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-emerald-500/5 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-60 pointer-events-none"></div>

      <div className="grid grid-cols-3 gap-6 h-full p-6">
        {/* Database Section */}
        <div className="rounded-3xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] backdrop-blur-xl border border-emerald-500/15 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          {/* Unique gradient pattern 1 */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/30 via-emerald-500/20 to-emerald-600/15 opacity-25"></div>
          <div className="absolute -top-20 left-1/4 w-40 h-40 bg-gradient-to-br from-emerald-500/40 to-transparent rounded-full blur-3xl transform rotate-45"></div>
          <div className="absolute bottom-1/3 -right-10 w-32 h-32 bg-gradient-to-tl from-emerald-500/30 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-emerald-600/25 to-transparent rounded-full blur-xl transform -rotate-45"></div>
          
          <div className="p-5 pt-6 relative z-10 bg-gradient-to-br from-white/[0.08] to-transparent rounded-2xl h-full flex flex-col">
            {/* Main icon and temperature-like display */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-600/20">
                  <MdOutlineAnalytics className="text-white text-3xl" />
                </div>
                <div className="ml-3">
                  <div className="text-4xl font-bold text-white tracking-tight">4.13<span className="text-lg font-normal text-white/80">M</span></div>
                  <div className="text-xs text-emerald-400 font-medium mt-0.5">Facilities</div>
                </div>
              </div>
              <div className="bg-[rgba(30,41,59,0.7)] backdrop-blur-md p-1.5 rounded-full shadow-sm border border-emerald-500/10">
                <MdOutlineSearch className="text-xl text-white/70" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">Database</h3>
            <p className="text-sm text-slate-300 mb-4">Access to 4.13 million facilities for solar potential analysis</p>
            
            {/* Weather-like status indicators */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-6 h-6 mr-3 text-emerald-400">
                  <MdOutlineCalendarMonth />
                </div>
                <div className="text-sm text-slate-200">Updated Daily</div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-6 h-6 mr-3 text-emerald-400">
                  <MdLocationOn />
                </div>
                <div className="text-sm text-slate-200">Coverage: 50 States</div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-6 h-6 mr-3 text-emerald-400">
                  <MdAccessTime />
                </div>
                <div className="text-sm text-slate-200">Last Sync: 2h ago</div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-[rgba(27,34,42,0.75)] rounded-xl p-3 border border-emerald-500/10">
                <h3 className="text-white text-sm font-medium mb-1">Market Coverage</h3>
                <div className="flex items-end justify-between">
                  <div className="text-xl font-bold text-emerald-500">42</div>
                  <div className="text-xs text-slate-400">States Active</div>
                </div>
                <div className="mt-1 h-1.5 bg-[rgba(27,34,42,0.95)] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '84%' }}></div>
                </div>
              </div>

              <div className="bg-[rgba(27,34,42,0.75)] rounded-xl p-3 border border-emerald-500/10">
                <h3 className="text-white text-sm font-medium mb-1">Top Regions</h3>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-200">California</span>
                    <span className="text-xs text-emerald-500">245 Sites</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-200">Texas</span>
                    <span className="text-xs text-emerald-500">189 Sites</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-200">Florida</span>
                    <span className="text-xs text-emerald-500">156 Sites</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Facility Locations Section */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-emerald-500/15 p-4 relative overflow-hidden flex-1">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-3">
                  <MdLocationOn className="text-emerald-500" />
                  Facility Locations
                </h2>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                    <span className="text-slate-200">High Activity</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500/60"></div>
                    <span className="text-slate-200">Active Markets</span>
                  </span>
                </div>
              </div>
              
              <div className="h-[calc(100%-3rem)]">
                <USMap className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Lead Enrichment Section */}
        <div className="rounded-3xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] backdrop-blur-xl border border-purple-500/15 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          {/* Background patterns matching Database section */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/30 via-violet-500/20 to-purple-600/15 opacity-25"></div>
          <div className="absolute -top-20 left-1/4 w-40 h-40 bg-gradient-to-br from-purple-500/40 to-transparent rounded-full blur-3xl transform rotate-45"></div>
          <div className="absolute bottom-1/3 -right-10 w-32 h-32 bg-gradient-to-tl from-violet-500/30 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-purple-600/25 to-transparent rounded-full blur-xl transform -rotate-45"></div>

          <div className="p-5 pt-6 relative z-10 bg-gradient-to-br from-white/[0.08] to-transparent rounded-2xl h-full flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-600 to-violet-500 flex items-center justify-center shadow-lg shadow-purple-600/20">
                  <MdOutlineLightbulb className="text-white text-3xl" />
                </div>
                <div className="ml-3">
                  <div className="text-4xl font-bold text-white tracking-tight">5.5<span className="text-lg font-normal text-white/80">k</span></div>
                  <div className="text-xs text-purple-400 font-medium mt-0.5">Data Points</div>
                </div>
              </div>
              <div className="bg-[rgba(30,41,59,0.7)] backdrop-blur-md p-1.5 rounded-full shadow-sm border border-purple-500/10">
                <MdOutlineSearch className="text-xl text-white/70" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">Lead Enrichment</h3>
            
            {/* Status Indicators */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-6 h-6 mr-3 text-purple-400">
                  <MdSun className="text-xl" />
                </div>
                <div className="text-sm text-slate-200">Solar Potential: High</div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-6 h-6 mr-3 text-purple-400">
                  <MdOutlineLocationOn />
                </div>
                <div className="text-sm text-slate-200">Coverage: 37 States</div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-6 h-6 mr-3 text-purple-400">
                  <MdAccessTime />
                </div>
                <div className="text-sm text-slate-200">Last Updated: 4h ago</div>
              </div>
            </div>

            {/* System Specs Box */}
            <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-3 border border-purple-500/10 mb-4 relative overflow-hidden group">
              {/* Glassmorphic effects */}
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-violet-500/5 to-purple-600/10 opacity-25 group-hover:opacity-30 transition-opacity"></div>
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <h3 className="text-white text-sm font-medium mb-2">System Specs</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  <div>
                    <div className="text-slate-400 text-xs">Capacity</div>
                    <div className="text-white font-bold">250 kW</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs">Efficiency</div>
                    <div className="text-white font-bold">21.4%</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs">Annual Output</div>
                    <div className="text-white font-bold">375 MWh</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs">Lifespan</div>
                    <div className="text-white font-bold">25+ yrs</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Solar Panel Image Box */}
            <div className="flex-1 bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-0 border border-purple-500/10 relative overflow-hidden group">
              {/* Glassmorphic effects */}
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-violet-500/5 to-purple-600/10 opacity-25 group-hover:opacity-30 transition-opacity"></div>
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl"></div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="relative flex-1 flex items-center justify-center w-full h-full">
                  <img 
                    src="/images/solar/Solar_panel2.png" 
                    alt="Solar Panel Installation" 
                    className="w-full h-full object-cover"
                  />
                  {/* Annotations */}
                  <div className="absolute top-4 left-4 bg-[#0f172a]/80 backdrop-blur-lg p-3 rounded-lg border border-purple-500/30 shadow-lg">
                    <div className="text-purple-400 text-sm font-medium">Average Energy Cost</div>
                    <div className="text-white text-lg font-bold">$12,500/mo</div>
                  </div>
                  <div className="absolute top-4 right-4 bg-[#0f172a]/80 backdrop-blur-lg p-3 rounded-lg border border-purple-500/30 shadow-lg">
                    <div className="text-purple-400 text-sm font-medium">Solar Savings</div>
                    <div className="text-white text-lg font-bold">-65%</div>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-[#0f172a]/80 backdrop-blur-lg p-3 rounded-lg border border-purple-500/30 shadow-lg">
                    <div className="text-purple-400 text-sm font-medium">ROI Period</div>
                    <div className="text-white text-lg font-bold">4.2 Years</div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-[#0f172a]/80 backdrop-blur-lg p-3 rounded-lg border border-purple-500/30 shadow-lg">
                    <div className="text-purple-400 text-sm font-medium">Carbon Reduction</div>
                    <div className="text-white text-lg font-bold">840 tons/yr</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personalized Outreach Section */}
        <div className="rounded-3xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] backdrop-blur-xl border border-green-500/15 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          {/* Background patterns matching Database section */}
          <div className="absolute inset-0 bg-gradient-to-tr from-green-500/30 via-emerald-500/20 to-green-600/15 opacity-25"></div>
          <div className="absolute -top-20 left-1/4 w-40 h-40 bg-gradient-to-br from-green-500/40 to-transparent rounded-full blur-3xl transform rotate-45"></div>
          <div className="absolute bottom-1/3 -right-10 w-32 h-32 bg-gradient-to-tl from-emerald-500/30 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-green-600/25 to-transparent rounded-full blur-xl transform -rotate-45"></div>

          <div className="p-5 pt-6 relative z-10 bg-gradient-to-br from-white/[0.08] to-transparent rounded-2xl h-full flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-600/20">
                  <MdOutlineEmail className="text-white text-3xl" />
                </div>
                <div className="ml-3">
                  <div className="text-4xl font-bold text-white tracking-tight">42<span className="text-lg font-normal text-white/80">%</span></div>
                  <div className="text-xs text-green-400 font-medium mt-0.5">Response Rate</div>
                </div>
              </div>
              <div className="bg-[rgba(30,41,59,0.7)] backdrop-blur-md p-1.5 rounded-full shadow-sm border border-green-500/10">
                <MdOutlineSearch className="text-xl text-white/70" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">Personalized Outreach</h3>
            
            {/* Status Indicators */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-6 h-6 mr-3 text-green-400">
                  <MdOutlineCloud className="text-xl" />
                </div>
                <div className="text-sm text-slate-200">Emails Sent: 85</div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-6 h-6 mr-3 text-green-400">
                  <MdOutlineLocationOn />
                </div>
                <div className="text-sm text-slate-200">Top Market: California</div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-6 h-6 mr-3 text-green-400">
                  <MdAccessTime />
                </div>
                <div className="text-sm text-slate-200">Last Campaign: 2d ago</div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-3 border border-green-500/10 mb-4 relative overflow-hidden group">
              {/* Glassmorphic effects */}
              <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 via-emerald-500/5 to-green-600/10 opacity-25 group-hover:opacity-30 transition-opacity"></div>
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="grid grid-cols-5 gap-3">
                  <div className="text-center">
                    <div className="text-green-400 text-sm mb-1">Sequence started</div>
                    <div className="text-white text-xl font-bold">3,726</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400 text-sm mb-1">Open rate</div>
                    <div className="text-white text-xl font-bold">48%<span className="text-sm text-slate-400">| 1,788</span></div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400 text-sm mb-1">Click rate</div>
                    <div className="text-white text-xl font-bold">24%<span className="text-sm text-slate-400">| 894</span></div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400 text-sm mb-1">Reply rate</div>
                    <div className="text-white text-xl font-bold">18%<span className="text-sm text-slate-400">| 671</span></div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400 text-sm mb-1">Opportunities</div>
                    <div className="text-white text-xl font-bold">85<span className="text-sm text-slate-400">| $245K</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Campaign Performance Graph */}
            <div className="flex-1 bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-4 border border-green-500/10 relative overflow-hidden group mt-6">
              {/* Glassmorphic effects */}
              <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 via-emerald-500/5 to-green-600/10 opacity-25 group-hover:opacity-30 transition-opacity"></div>
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-2xl"></div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white text-sm font-medium">Campaign Performance</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-xs text-slate-300">Sent</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span className="text-xs text-slate-300">Opens</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs text-slate-300">Unique</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="text-xs text-slate-300">Replies</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={campaignData}>
                      <defs>
                        <linearGradient id="sentGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="opensGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="uniqueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="repliesGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                        </linearGradient>
                        <filter id="shadow" height="200%">
                          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.3)" />
                        </filter>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                      <XAxis 
                        dataKey="date" 
                        stroke="#6B7280"
                        tick={{ fill: '#9CA3AF' }}
                        axisLine={{ stroke: '#374151', strokeWidth: 1 }}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="#6B7280"
                        tick={{ fill: '#9CA3AF' }}
                        axisLine={{ stroke: '#374151', strokeWidth: 1 }}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(34, 197, 94, 0.2)',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                        itemStyle={{ color: '#e2e8f0' }}
                        labelStyle={{ color: '#e2e8f0' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="sent" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#111827' }}
                        filter="url(#shadow)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="totalOpens" 
                        stroke="#A855F7" 
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6, stroke: '#A855F7', strokeWidth: 2, fill: '#111827' }}
                        filter="url(#shadow)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="uniqueOpens" 
                        stroke="#22C55E" 
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6, stroke: '#22C55E', strokeWidth: 2, fill: '#111827' }}
                        filter="url(#shadow)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="replies" 
                        stroke="#F97316" 
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6, stroke: '#F97316', strokeWidth: 2, fill: '#111827' }}
                        filter="url(#shadow)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
