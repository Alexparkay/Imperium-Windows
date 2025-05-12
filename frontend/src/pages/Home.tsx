import React from 'react';
import { useState } from 'react';
import TopDealsBox from '../components/topDealsBox/TopDealsBox';
import ChartBox from '../components/charts/ChartBox';
import USMap from '../components/maps/USMap';
import { useQuery } from '@tanstack/react-query';
import SplineWrapper from '../components/SplineWrapper';
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

// Mock data for Imperum SAP dashboard
const dashboardData = {
  companiesScraped: {
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
  companiesAnalyzed: {
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
  sapEvaluations: {
    total: 98,
    averageLicense: "3,250 Users",
    averageCost: "$1.9M",
    chartData: [
      { name: "Jan", value: 2800 },
      { name: "Feb", value: 2900 },
      { name: "Mar", value: 3100 },
      { name: "Apr", value: 3300 },
      { name: "May", value: 3500 },
      { name: "Jun", value: 3700 },
      { name: "Jul", value: 3600 },
      { name: "Aug", value: 3400 }
    ]
  },
  migrationPotential: {
    companiesEvaluated: 92,
    averageROI: "185%",
    averageImplementation: "7.8 months",
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
  topCompanies: [
    {
      id: 1,
      name: "Apple Inc.",
      location: "Cupertino, CA",
      savings: "$3.2M",
      roi: "205.3%",
      status: "Interested"
    },
    {
      id: 2,
      name: "Tesla Motors",
      location: "Austin, TX",
      savings: "$1.8M",
      roi: "245.8%",
      status: "Email Sent"
    },
    {
      id: 3,
      name: "Amazon",
      location: "Seattle, WA",
      savings: "$4.5M",
      roi: "198.2%",
      status: "Follow-up Scheduled"
    },
    {
      id: 4,
      name: "Honeywell",
      location: "Charlotte, NC",
      savings: "$1.6M",
      roi: "156.2%",
      status: "Email Opened"
    },
    {
      id: 5,
      name: "Walmart",
      location: "Bentonville, AR",
      savings: "$5.8M",
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

// Add this email campaign data near the top of the file, after the existing mock data
const emailCampaignData = [
  { day: 'Mon', sent: 400, opened: 180, clicked: 80 },
  { day: 'Tue', sent: 420, opened: 200, clicked: 90 },
  { day: 'Wed', sent: 450, opened: 230, clicked: 120 },
  { day: 'Thu', sent: 420, opened: 180, clicked: 85 },
  { day: 'Fri', sent: 400, opened: 165, clicked: 75 },
  { day: 'Sat', sent: 80, opened: 20, clicked: 10 },
  { day: 'Sun', sent: 60, opened: 15, clicked: 5 },
];

// Add migration timeline data
const migrationTimelineData = [
  { company: 'Enterprise A', size: 'Large', timelineMonths: 12, complexity: 'High', modules: 14, status: 'In Progress' },
  { company: 'Enterprise B', size: 'Medium', timelineMonths: 8, complexity: 'Medium', modules: 9, status: 'Planning' },
  { company: 'Enterprise C', size: 'Small', timelineMonths: 6, complexity: 'Low', modules: 6, status: 'Complete' },
  { company: 'Enterprise D', size: 'Large', timelineMonths: 14, complexity: 'Very High', modules: 18, status: 'Planning' },
  { company: 'Enterprise E', size: 'Medium', timelineMonths: 9, complexity: 'Medium', modules: 10, status: 'In Progress' },
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

      {/* 3D Spline Component */}
      <div className="fixed w-full h-full z-0 opacity-90 pointer-events-none">
        <SplineWrapper scene="https://prod.spline.design/7o3AL69KlurQ-HoD/scene.splinecode" />
      </div>

      {/* Layout with left-aligned widgets */}
      <div className="flex h-screen p-6 relative z-10">
        {/* Left Column - stacked widgets */}
        <div className="w-1/4 h-full flex flex-col space-y-6">
          {/* SAP Enterprise Database box */}
          <div className="rounded-3xl bg-gradient-to-br from-[#28292b]/60 via-[#28292b]/40 to-[rgba(40,41,43,0.15)] backdrop-blur-xl border border-emerald-500/15 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden group">
            {/* Unique gradient pattern 1 */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-emerald-500/15 to-emerald-600/10 opacity-20"></div>
            <div className="absolute -top-24 left-1/4 w-40 h-40 bg-gradient-to-br from-emerald-500/30 to-transparent rounded-full blur-3xl transform rotate-45"></div>
            <div className="absolute bottom-1/3 -right-16 w-32 h-32 bg-gradient-to-tl from-emerald-500/20 to-transparent rounded-full blur-2xl"></div>
            
            <div className="p-5 pt-6 relative z-10 bg-gradient-to-br from-white/[0.06] to-transparent rounded-2xl flex flex-col">
              {/* Main icon and metrics display */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-600/20">
                    <MdOutlineAnalytics className="text-white text-3xl" />
                  </div>
                  <div className="ml-3">
                    <div className="text-4xl font-bold text-white tracking-tight">4.13<span className="text-lg font-normal text-white/80">M</span></div>
                    <div className="text-xs text-emerald-400 font-medium mt-0.5">SAP Enterprises</div>
                  </div>
                </div>
                <div className="bg-[rgba(30,41,59,0.7)] backdrop-blur-md p-1.5 rounded-full shadow-sm border border-emerald-500/10">
                  <MdOutlineSearch className="text-xl text-white/70" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">SAP Enterprise Database</h3>
              <p className="text-sm text-slate-300 mb-4">Access to 4.13 million companies using SAP ECC for migration</p>
              
              {/* Status indicators */}
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
                  <div className="text-sm text-slate-200">Global Coverage: 87 Countries</div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-6 h-6 mr-3 text-emerald-400">
                    <MdAccessTime />
                  </div>
                  <div className="text-sm text-slate-200">Last Sync: 2h ago</div>
                </div>
              </div>
            </div>
          </div>

          {/* S/4HANA Analysis box */}
          <div className="rounded-3xl bg-gradient-to-br from-[#28292b]/60 via-[#28292b]/40 to-[rgba(40,41,43,0.15)] backdrop-blur-xl border border-emerald-500/15 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden group flex-1">
            {/* Background patterns */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-emerald-500/15 to-emerald-600/10 opacity-20"></div>
            <div className="absolute -top-24 left-1/4 w-40 h-40 bg-gradient-to-br from-emerald-500/30 to-transparent rounded-full blur-3xl transform rotate-45"></div>
            <div className="absolute bottom-1/3 -right-16 w-32 h-32 bg-gradient-to-tl from-emerald-500/20 to-transparent rounded-full blur-2xl"></div>

            <div className="p-5 pt-6 relative z-10 bg-gradient-to-br from-white/[0.06] to-transparent rounded-2xl h-full flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-600/20">
                    <MdOutlineLightbulb className="text-white text-2xl" />
                  </div>
                  <div className="ml-3">
                    <div className="text-3xl font-bold text-white tracking-tight">74<span className="text-sm font-normal text-white/80">%</span></div>
                    <div className="text-xs text-emerald-400 font-medium mt-0.5">Migration Readiness</div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2">S/4HANA Analysis</h3>
              
              {/* Migration Stages Progress */}
              <div className="bg-[rgba(27,34,42,0.5)] backdrop-blur-md rounded-xl p-4 border border-emerald-500/10 mb-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-emerald-500/5 to-emerald-600/5 opacity-20"></div>
                
                <div className="relative z-10">
                  <h3 className="text-white text-xs font-medium mb-3">Migration Pipeline</h3>
                  <div className="space-y-2.5">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-300 text-xs">Discovery</span>
                        <span className="text-emerald-400 text-xs font-medium">98</span>
                      </div>
                      <div className="h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-300 text-xs">Assessment</span>
                        <span className="text-emerald-400 text-xs font-medium">76</span>
                      </div>
                      <div className="h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: '74%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-300 text-xs">Proposal</span>
                        <span className="text-emerald-400 text-xs font-medium">52</span>
                      </div>
                      <div className="h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: '50%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Migration Timeline - Simplified to just numbers */}
              <div className="bg-[rgba(27,34,42,0.5)] backdrop-blur-md rounded-xl p-4 border border-emerald-500/10 mb-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-emerald-500/5 to-emerald-600/5 opacity-20"></div>
                
                <div className="relative z-10">
                  <h3 className="text-white text-xs font-medium mb-3">Migration Timeline</h3>
                  
                  {/* Timeline data - Simple grid with key metrics */}
                  <div className="grid grid-cols-3 gap-x-3">
                    <div>
                      <div className="text-emerald-400 text-xs font-medium">Avg. Timeline</div>
                      <div className="text-white text-lg font-bold">9.8 <span className="text-sm">months</span></div>
                    </div>
                    
                    <div>
                      <div className="text-emerald-400 text-xs font-medium">Modules</div>
                      <div className="text-white text-lg font-bold">11.4 <span className="text-sm">avg</span></div>
                    </div>
                    
                    <div>
                      <div className="text-emerald-400 text-xs font-medium">Team Size</div>
                      <div className="text-white text-lg font-bold">8-12</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Benefits Analysis */}
              <div className="flex-1 bg-[rgba(27,34,42,0.5)] backdrop-blur-md rounded-xl p-4 border border-emerald-500/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-emerald-500/5 to-emerald-600/5 opacity-20"></div>
                
                <div className="relative z-10">
                  <h3 className="text-white text-xs font-medium mb-3">S/4HANA Benefits</h3>
                  
                  <div className="space-y-2">
                    <div className="bg-[rgba(15,23,42,0.4)] backdrop-blur-sm rounded-lg border border-emerald-500/10 p-2">
                      <div className="text-emerald-400 text-xs font-medium">Performance</div>
                      <div className="text-white text-lg font-bold">78%</div>
                      <div className="flex items-center text-emerald-300 text-xs">
                        <MdTrendingUp className="mr-1" />
                        <span>+53% Speed</span>
                      </div>
                    </div>
                    
                    <div className="bg-[rgba(15,23,42,0.4)] backdrop-blur-sm rounded-lg border border-emerald-500/10 p-2">
                      <div className="text-emerald-400 text-xs font-medium">TCO Reduction</div>
                      <div className="text-white text-lg font-bold">35%</div>
                      <div className="flex items-center text-emerald-300 text-xs">
                        <MdTrendingUp className="mr-1" />
                        <span>$4.2M Savings</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Center/Right area - mostly empty for the 3D visualization */}
        <div className="flex-1 relative h-full flex justify-end items-end">
          {/* Right side widget - positioned at bottom right */}
          <div className="w-2/5 mb-6">
            <div className="rounded-3xl bg-gradient-to-br from-[#28292b]/60 via-[#28292b]/40 to-[rgba(40,41,43,0.15)] backdrop-blur-xl border border-emerald-500/15 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden group">
              {/* Background patterns */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-emerald-500/15 to-emerald-600/10 opacity-20"></div>
              <div className="absolute -top-24 left-1/4 w-40 h-40 bg-gradient-to-br from-emerald-500/30 to-transparent rounded-full blur-3xl transform rotate-45"></div>
              <div className="absolute bottom-1/3 -right-16 w-32 h-32 bg-gradient-to-tl from-emerald-500/20 to-transparent rounded-full blur-2xl"></div>

              <div className="p-5 pt-6 relative z-10 bg-gradient-to-br from-white/[0.06] to-transparent rounded-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-600/20">
                      <MdOutlineEmail className="text-white text-2xl" />
                    </div>
                    <div className="ml-3">
                      <div className="text-3xl font-bold text-white tracking-tight">42<span className="text-sm font-normal text-white/80">%</span></div>
                      <div className="text-xs text-emerald-400 font-medium mt-0.5">Response Rate</div>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-4">Email Campaign Performance</h3>
                
                {/* Email Performance Graph - fixed to match the image */}
                <div className="bg-[rgba(27,34,42,0.5)] backdrop-blur-md rounded-xl p-4 border border-emerald-500/10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-emerald-500/5 to-emerald-600/5 opacity-20"></div>
                  
                  <div className="relative z-10">
                    {/* Chart Graph */}
                    <div className="h-28 relative flex items-end">
                      {/* Grid lines */}
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                        <div className="border-t border-slate-600/30"></div>
                        <div className="border-t border-slate-600/30"></div>
                        <div className="border-t border-slate-600/30"></div>
                        <div className="border-t border-slate-600/30"></div>
                        <div className="border-t border-slate-600/30"></div>
                      </div>
                      
                      {/* Days of week and bars */}
                      <div className="w-full h-full flex justify-between items-end">
                        {emailCampaignData.map((item, index) => (
                          <div key={index} className="flex flex-col items-center">
                            {/* Bar group */}
                            <div className="flex items-end space-x-0.5 mb-1">
                              {/* Sent bar */}
                              <div 
                                style={{ height: `${Math.min(100, item.sent / 5)}px` }} 
                                className="w-3 bg-emerald-500 rounded-t"
                              ></div>
                              
                              {/* Opened bar */}
                              <div 
                                style={{ height: `${Math.min(100, item.opened / 5)}px` }} 
                                className="w-3 bg-blue-500 rounded-t"
                              ></div>
                              
                              {/* Clicked bar */}
                              <div 
                                style={{ height: `${Math.min(100, item.clicked / 5)}px` }} 
                                className="w-3 bg-purple-500 rounded-t"
                              ></div>
                            </div>
                            
                            {/* Day label */}
                            <div className="text-xs text-slate-400">{item.day}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Legend */}
                    <div className="flex justify-center mt-4 space-x-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-emerald-500 rounded-sm mr-1"></div>
                        <span className="text-xs text-emerald-400">Sent</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-sm mr-1"></div>
                        <span className="text-xs text-blue-400">Opened</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-purple-500 rounded-sm mr-1"></div>
                        <span className="text-xs text-purple-400">Clicked</span>
                      </div>
                    </div>
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

export default Home;
