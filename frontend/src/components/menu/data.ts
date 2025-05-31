// import toast from 'react-hot-toast';
import {
  HiOutlineHome,
  HiOutlineUser,
} from 'react-icons/hi2';
import { 
  MdSolarPower, 
  MdFactory, 
  MdLocationOn, 
  MdElectricBolt, 
  MdOutlineAnalytics,
  MdOutlineEmail,
  MdOutlineTrackChanges,
  MdAttachMoney,
  MdOutlineDashboard,
  MdOutlineBusiness,
  MdOutlineSearch,
  MdOutlineScanner,
  MdOutlineDataObject,
  MdOutlineInsights,
  MdOutlineCampaign,
  MdOutlineDesignServices
} from 'react-icons/md';

export const menu = [
  {
    catalog: 'main',
    listItems: [
      {
        isLink: true,
        url: '/',
        icon: MdOutlineDashboard,
        label: 'Dashboard',
        colorScheme: 'accent-primary'
      },
      {
        isLink: true,
        url: '/profile',
        icon: MdOutlineBusiness,
        label: 'Company Profile',
        colorScheme: 'accent-primary'
      },
    ],
  },
  {
    catalog: 'imperium sap workflow',
    listItems: [
      {
        isLink: true,
        url: '/market-database',
        icon: MdOutlineSearch,
        label: 'Database',
        colorScheme: 'accent-primary'
      },
      {
        isLink: true,
        url: '/signal-scanner',
        icon: MdOutlineDataObject,
        label: 'Data Enrichment',
        colorScheme: 'accent-primary'
      },
      {
        isLink: true,
        url: '/data-analytics',
        icon: MdOutlineAnalytics,
        label: 'Data Analytics',
        colorScheme: 'accent-primary'
      },
      {
        isLink: true,
        url: '/migration-insights',
        icon: MdOutlineInsights,
        label: 'Logistics Insights',
        colorScheme: 'accent-primary'
      },
      {
        isLink: true,
        url: '/outreach',
        icon: MdOutlineCampaign,
        label: 'Outreach',
        colorScheme: 'accent-primary'
      },
      {
        isLink: true,
        url: '/outreach-tracking',
        icon: MdOutlineTrackChanges,
        label: 'Outreach Tracking',
        colorScheme: 'accent-primary'
      },
    ],
  },
];
