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
  MdOutlineCampaign
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
        colorScheme: 'green'
      },
      {
        isLink: true,
        url: '/profile',
        icon: MdOutlineBusiness,
        label: 'Partner Profile',
        colorScheme: 'green'
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
        label: 'Market Database',
        colorScheme: 'green'
      },
      {
        isLink: true,
        url: '/signal-scanner',
        icon: MdOutlineScanner,
        label: 'Signal Scanner',
        colorScheme: 'green'
      },
      {
        isLink: true,
        url: '/data-enrichment',
        icon: MdOutlineDataObject,
        label: 'Data Enrichment',
        colorScheme: 'green'
      },
      {
        isLink: true,
        url: '/migration-insights',
        icon: MdOutlineInsights,
        label: 'Migration Insights',
        colorScheme: 'green'
      },
      {
        isLink: true,
        url: '/outreach',
        icon: MdOutlineCampaign,
        label: 'Outreach',
        colorScheme: 'green'
      },
      {
        isLink: true,
        url: '/outreach-tracking',
        icon: MdOutlineTrackChanges,
        label: 'Outreach Tracking',
        colorScheme: 'green'
      },
    ],
  },
];
