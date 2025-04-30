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
  MdAttachMoney
} from 'react-icons/md';

export const menu = [
  {
    catalog: 'main',
    listItems: [
      {
        isLink: true,
        url: '/',
        icon: HiOutlineHome,
        label: 'dashboard',
        colorScheme: 'green'
      },
      {
        isLink: true,
        url: '/profile',
        icon: HiOutlineUser,
        label: 'company profile',
        colorScheme: 'green'
      },
    ],
  },
  {
    catalog: 'imperium sap workflow',
    listItems: [
      {
        isLink: true,
        url: '/facility-database',
        icon: MdLocationOn,
        label: 'facility database',
        colorScheme: 'green'
      },
      {
        isLink: true,
        url: '/facility-ai-analysis',
        icon: MdFactory,
        label: 'facility ai analysis',
        colorScheme: 'green'
      },
      {
        isLink: true,
        url: '/energy-usage-estimation',
        icon: MdElectricBolt,
        label: 'energy usage\nestimation',
        colorScheme: 'green'
      },
      {
        isLink: true,
        url: '/solar-panel-potential',
        icon: MdSolarPower,
        label: 'solar panel potential',
        colorScheme: 'green'
      },
      {
        isLink: true,
        url: '/email-automation',
        icon: MdOutlineEmail,
        label: 'email automation',
        colorScheme: 'green'
      },
      {
        isLink: true,
        url: '/outreach-tracking',
        icon: MdOutlineTrackChanges,
        label: 'outreach tracking',
        colorScheme: 'green'
      },
    ],
  },
];
