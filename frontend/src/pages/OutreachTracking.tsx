import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdOutlineEmail, 
  MdPhone, 
  MdCheck, 
  MdClose, 
  MdOutlineSchedule, 
  MdOutlineCalendarToday, 
  MdNotes, 
  MdOutlineInsights, 
  MdOutlineBarChart, 
  MdOutlinePieChart, 
  MdOutlineShowChart,
  MdOutlineTrackChanges,
  MdOutlineQueryStats,
  MdOutlineMoreVert,
  MdOutlineTrendingUp,
  MdOutlineAttachMoney,
  MdOutlineGroups,
  MdOutlineSpeed,
  MdOutlineTimeline,
  MdOutlineAnalytics,
  MdOutlineAssessment,
  MdOutlineDataUsage,
  MdOutlineTrendingDown,
  MdOutlineTrendingFlat,
  MdExpandMore,
  MdExpandLess,
  MdOutlineMailOutline,
  MdOutlineOpenInNew,
  MdOutlineMouse,
  MdOutlineReply,
  MdFilterList,
  MdSort,
  MdChevronLeft,
  MdChevronRight,
  MdSend,
  MdOutlineChat,
  MdOutlinePerson,
  MdOutlineBusiness,
  MdOutlineLocationOn,
  MdOutlineWork,
  MdOutlineAccessTime,
  MdOutlineTag,
  MdOutlineStar,
  MdOutlineSearch,
  MdOutlineFilterList,
  MdOutlinePersonAdd
} from 'react-icons/md';
import { FaRegEdit, FaRegTrashAlt, FaRegClock, FaRegCheckCircle, FaRegTimesCircle, FaRegLightbulb, FaRegChartBar, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { 
  BarChart, Bar, 
  PieChart, Pie, Cell, 
  LineChart, Line, 
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

// Add HTMLDialogElement to the global Window interface
declare global {
  interface HTMLElementTagNameMap {
    'dialog': HTMLDialogElement;
  }
}

interface EmailStatus {
  drafted: boolean;
  sent: boolean;
  scheduled: boolean;
  scheduledDate?: Date;
}

interface Facility {
  id: number;
  name: string;
  industry: string;
  location: string;
  manager: string;
  email: string;
  phone: string;
  emailStatus: EmailStatus;
  outreachStatus: {
    opened: boolean;
    openedAt?: Date;
    replied: boolean;
    repliedAt?: Date;
    interested: boolean | null;
    followUpScheduled: boolean;
    followUpDate?: Date;
    notes: string;
  };
  solarPotential: {
    annualSavings: number;
  };
}

type ChannelType = 'email' | 'linkedin' | 'whatsapp';

const OutreachTracking = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [outreachData, setOutreachData] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [activeTab, setActiveTab] = useState<ChannelType>('email');
  const [showContacts, setShowContacts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(28);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalContacts, setTotalContacts] = useState(12347);
  const [selectedColumns, setSelectedColumns] = useState(['name', 'email', 'company', 'position', 'location', 'status', 'lastContact']);
  
  // Extended sample data for contacts to make it look more like a big database
  const expandedContacts = [
    { id: 1, name: "Jeff Levy", email: "j.levy@example.com", company: "SAP Finance", location: "Atlanta, GA", position: "SAP Manager", status: "Engaged", lastContact: "2023-06-17", tags: ["SAP S/4HANA", "Decision Maker"], leadScore: 87, outreachHistory: [
      { id: 1, date: "2023-06-17", type: "email", subject: "SAP Migration Proposal", status: "sent", response: "interested", notes: "Interested in learning more about the ROI" },
      { id: 2, date: "2023-06-10", type: "email", subject: "Introduction to SAP S/4HANA", status: "sent", response: "positive", notes: "Requested more information" }
    ] },
    { id: 2, name: "Amy Huke", email: "a.huke@example.com", company: "Honeywell", location: "Kansas City, MO", position: "ERP Director", status: "New", lastContact: "2023-06-15", tags: ["Manufacturing", "Prospect"], leadScore: 62, outreachHistory: [
      { id: 1, date: "2023-06-15", type: "email", subject: "SAP Cloud Migration", status: "sent", response: "none", notes: "" }
    ] },
    { id: 3, name: "Ryan Kuddes", email: "r.kuddes@example.com", company: "Siemens", location: "Denver, CO", position: "IT Manager", status: "Engaged", lastContact: "2023-06-22", tags: ["SAP", "Prospect"], leadScore: 73, outreachHistory: [
      { id: 1, date: "2023-06-22", type: "email", subject: "SAP S/4HANA Implementation", status: "sent", response: "positive", notes: "Scheduled a follow-up call" },
      { id: 2, date: "2023-06-15", type: "call", subject: "Initial Introduction", status: "completed", response: "interested", notes: "Showed interest in our solutions" }
    ] },
    { id: 4, name: "Zuretti Carter", email: "z.carter@example.com", company: "ChargePoint", location: "San Francisco, CA", position: "Facilities Manager", status: "Not Interested", lastContact: "2023-06-15", tags: ["EV", "NeedNurturing"], leadScore: 45, outreachHistory: [
      { id: 1, date: "2023-06-15", type: "email", subject: "Solar Energy Benefits", status: "sent", response: "not_interested", notes: "Not looking to invest at this time" }
    ] },
    { id: 5, name: "Scott Simpson", email: "s.simpson@example.com", company: "Plexus Corp.", location: "Neenah, WI", position: "Facilities Manager", status: "Evaluating", lastContact: "2023-06-20", tags: ["Manufacturing", "Evaluating"], leadScore: 58, outreachHistory: [
      { id: 1, date: "2023-06-20", type: "email", subject: "Solar ROI Analysis", status: "sent", response: "neutral", notes: "Reviewing the proposal" },
      { id: 2, date: "2023-06-12", type: "email", subject: "Introduction to Solar Solutions", status: "sent", response: "positive", notes: "Requested a detailed analysis" }
    ] },
    { id: 6, name: "Jennifer Morris", email: "j.morris@example.com", company: "Microsoft", location: "Redmond, WA", position: "Energy Director", status: "Engaged", lastContact: "2023-06-18", tags: ["Tech", "Decision Maker"], leadScore: 92, outreachHistory: [
      { id: 1, date: "2023-06-18", type: "email", subject: "Customized Solar Proposal", status: "sent", response: "interested", notes: "Very interested in moving forward" }
    ] },
    { id: 7, name: "David Chen", email: "d.chen@example.com", company: "Tesla", location: "Fremont, CA", position: "Sustainability Lead", status: "Engaged", lastContact: "2023-06-19", tags: ["EV", "Solar", "Hot Lead"], leadScore: 95, outreachHistory: [
      { id: 1, date: "2023-06-19", type: "call", subject: "Solar Implementation Discussion", status: "completed", response: "positive", notes: "Ready to proceed with installation" }
    ] },
    { id: 8, name: "Sarah Johnson", email: "s.johnson@example.com", company: "General Electric", location: "Boston, MA", position: "Operations Manager", status: "New", lastContact: "2023-06-14", tags: ["Manufacturing", "Prospect"], leadScore: 67, outreachHistory: [
      { id: 1, date: "2023-06-14", type: "email", subject: "Introduction to Solar Solutions", status: "sent", response: "none", notes: "" }
    ] },
    { id: 9, name: "Michael Rodriguez", email: "m.rodriguez@example.com", company: "Ford", location: "Dearborn, MI", position: "Facilities Director", status: "Engaged", lastContact: "2023-06-16", tags: ["Manufacturing", "Evaluating"], leadScore: 78, outreachHistory: [
      { id: 1, date: "2023-06-16", type: "email", subject: "Solar Energy Savings", status: "sent", response: "interested", notes: "Requested follow-up call" }
    ] },
    { id: 10, name: "Lisa Thompson", email: "l.thompson@example.com", company: "Amazon", location: "Seattle, WA", position: "Sustainability Manager", status: "Evaluating", lastContact: "2023-06-21", tags: ["Tech", "Prospect"], leadScore: 82, outreachHistory: [
      { id: 1, date: "2023-06-21", type: "call", subject: "ROI Discussion", status: "completed", response: "neutral", notes: "Still comparing options" }
    ] },
    { id: 11, name: "Robert Williams", email: "r.williams@example.com", company: "IBM", location: "Armonk, NY", position: "Facilities Manager", status: "New", lastContact: "2023-06-15", tags: ["Tech", "NeedNurturing"], leadScore: 55, outreachHistory: [
      { id: 1, date: "2023-06-15", type: "email", subject: "Introduction to Solar Solutions", status: "sent", response: "none", notes: "" }
    ] },
    { id: 12, name: "Emily Davis", email: "e.davis@example.com", company: "Google", location: "Mountain View, CA", position: "Energy Procurement", status: "Engaged", lastContact: "2023-06-20", tags: ["Tech", "Hot Lead"], leadScore: 88, outreachHistory: [
      { id: 1, date: "2023-06-20", type: "email", subject: "Solar Panel Installation", status: "sent", response: "positive", notes: "Ready to proceed" }
    ] },
    { id: 13, name: "James Wilson", email: "j.wilson@example.com", company: "Walmart", location: "Bentonville, AR", position: "Sustainability Director", status: "Evaluating", lastContact: "2023-06-17", tags: ["Retail", "Decision Maker"], leadScore: 76, outreachHistory: [
      { id: 1, date: "2023-06-17", type: "email", subject: "Solar Energy Proposal", status: "sent", response: "neutral", notes: "Reviewing with team" }
    ] },
    { id: 14, name: "Ashley Martinez", email: "a.martinez@example.com", company: "Target", location: "Minneapolis, MN", position: "Operations Manager", status: "New", lastContact: "2023-06-14", tags: ["Retail", "Prospect"], leadScore: 63, outreachHistory: [
      { id: 1, date: "2023-06-14", type: "email", subject: "Introduction to Solar Solutions", status: "sent", response: "none", notes: "" }
    ] },
    { id: 15, name: "Kevin Lee", email: "k.lee@example.com", company: "Samsung", location: "San Jose, CA", position: "Facilities Manager", status: "Engaged", lastContact: "2023-06-19", tags: ["Tech", "Manufacturing", "Evaluating"], leadScore: 81, outreachHistory: [
      { id: 1, date: "2023-06-19", type: "call", subject: "Solar Implementation Discussion", status: "completed", response: "interested", notes: "Very enthusiastic about potential" }
    ] },
    { id: 16, name: "Rachel Brown", email: "r.brown@example.com", company: "CVS Health", location: "Woonsocket, RI", position: "Energy Manager", status: "New", lastContact: "2023-06-15", tags: ["Healthcare", "Prospect"], leadScore: 60, outreachHistory: [
      { id: 1, date: "2023-06-15", type: "email", subject: "Introduction to Solar Solutions", status: "sent", response: "none", notes: "" }
    ] },
    { id: 17, name: "Daniel Miller", email: "d.miller@example.com", company: "Intel", location: "Santa Clara, CA", position: "Facilities Director", status: "Engaged", lastContact: "2023-06-18", tags: ["Tech", "Manufacturing", "Hot Lead"], leadScore: 89, outreachHistory: [
      { id: 1, date: "2023-06-18", type: "email", subject: "Solar Panel Installation", status: "sent", response: "positive", notes: "Ready to schedule installation" }
    ] },
    { id: 18, name: "Olivia Garcia", email: "o.garcia@example.com", company: "PepsiCo", location: "Purchase, NY", position: "Sustainability Lead", status: "Evaluating", lastContact: "2023-06-20", tags: ["Food & Beverage", "Decision Maker"], leadScore: 74, outreachHistory: [
      { id: 1, date: "2023-06-20", type: "email", subject: "Solar Energy Proposal", status: "sent", response: "neutral", notes: "Comparing with other vendors" }
    ] },
    { id: 19, name: "Steven Wright", email: "s.wright@example.com", company: "Coca-Cola", location: "Atlanta, GA", position: "Operations Manager", status: "Engaged", lastContact: "2023-06-16", tags: ["Food & Beverage", "Evaluating"], leadScore: 79, outreachHistory: [
      { id: 1, date: "2023-06-16", type: "call", subject: "Solar ROI Discussion", status: "completed", response: "interested", notes: "Excited about the ROI numbers" }
    ] },
    { id: 20, name: "Isabella Lopez", email: "i.lopez@example.com", company: "Johnson & Johnson", location: "New Brunswick, NJ", position: "Facilities Manager", status: "New", lastContact: "2023-06-15", tags: ["Healthcare", "Prospect"], leadScore: 65, outreachHistory: [
      { id: 1, date: "2023-06-15", type: "email", subject: "Introduction to Solar Solutions", status: "sent", response: "none", notes: "" }
    ] },
    { id: 21, name: "Andrew Taylor", email: "a.taylor@example.com", company: "Nike", location: "Beaverton, OR", position: "Sustainability Director", status: "Engaged", lastContact: "2023-06-19", tags: ["Retail", "Hot Lead"], leadScore: 86, outreachHistory: [
      { id: 1, date: "2023-06-19", type: "email", subject: "Solar Panel Implementation", status: "sent", response: "positive", notes: "Ready to move forward" }
    ] },
    { id: 22, name: "Natalie Adams", email: "n.adams@example.com", company: "Pfizer", location: "New York, NY", position: "Energy Manager", status: "Evaluating", lastContact: "2023-06-17", tags: ["Healthcare", "Decision Maker"], leadScore: 77, outreachHistory: [
      { id: 1, date: "2023-06-17", type: "email", subject: "Solar Energy Proposal", status: "sent", response: "neutral", notes: "Still in review process" }
    ] },
    { id: 23, name: "Eric Perez", email: "e.perez@example.com", company: "FedEx", location: "Memphis, TN", position: "Facilities Manager", status: "New", lastContact: "2023-06-14", tags: ["Logistics", "Prospect"], leadScore: 61, outreachHistory: [
      { id: 1, date: "2023-06-14", type: "email", subject: "Introduction to Solar Solutions", status: "sent", response: "none", notes: "" }
    ] },
    { id: 24, name: "Sophia Scott", email: "s.scott@example.com", company: "UPS", location: "Atlanta, GA", position: "Operations Director", status: "Engaged", lastContact: "2023-06-20", tags: ["Logistics", "Evaluating"], leadScore: 83, outreachHistory: [
      { id: 1, date: "2023-06-20", type: "call", subject: "Solar Implementation", status: "completed", response: "interested", notes: "Scheduled follow-up meeting" }
    ] },
    { id: 25, name: "Christopher Allen", email: "c.allen@example.com", company: "Cisco", location: "San Jose, CA", position: "Facilities Manager", status: "Evaluating", lastContact: "2023-06-18", tags: ["Tech", "Decision Maker"], leadScore: 75, outreachHistory: [
      { id: 1, date: "2023-06-18", type: "email", subject: "Solar Energy Proposal", status: "sent", response: "neutral", notes: "Reviewing proposal details" }
    ] }
  ];

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    setTimeout(() => {
      setOutreachData(expandedContacts);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/20';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border border-green-500/20';
      case 'scheduled':
        return 'bg-orange-500/20 text-orange-400 border border-orange-500/20';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/20';
    }
  };

  const getResponseColor = (response: string) => {
    switch (response) {
      case 'interested':
      case 'positive':
        return 'text-green-500';
      case 'not_interested':
        return 'text-red-500';
      case 'neutral':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  const getResponseIcon = (response: string) => {
    switch (response) {
      case 'interested':
      case 'positive':
        return <FaRegCheckCircle className="text-success" />;
      case 'not_interested':
        return <FaRegTimesCircle className="text-error" />;
      case 'neutral':
        return <FaRegClock className="text-warning" />;
      case 'none':
      case 'pending':
      default:
        return <FaRegClock className="text-gray-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <MdOutlineEmail className="text-primary" />;
      case 'call':
        return <MdPhone className="text-primary" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddNote = () => {
    if (!selectedContact || !newNote.trim()) {
      return;
    }

    // In a real app, you would make an API call here
    toast.success('Note added successfully');
    setNewNote('');
    setShowNoteModal(false);
  };

  const handleScheduleFollowUp = (contact: any) => {
    // In a real app, you would navigate to the email composer or show a scheduling modal
    toast.success(`Follow-up scheduled for ${contact.name}`);
  };

  const filteredData = outreachData.filter(contact => {
    if (filterStatus === 'all') return true;
    
    // Check if contact has outreachHistory property
    if (!contact.outreachHistory || !Array.isArray(contact.outreachHistory) || contact.outreachHistory.length === 0) {
      return false;
    }
    
    // Check if any outreach matches the filter
    return contact.outreachHistory.some((outreach: any) => {
      if (filterStatus === 'interested') {
        return ['interested', 'positive'].includes(outreach.response);
      } else if (filterStatus === 'not_interested') {
        return outreach.response === 'not_interested';
      } else if (filterStatus === 'no_response') {
        return outreach.response === 'none';
      } else if (filterStatus === 'pending') {
        return outreach.status === 'scheduled';
      }
      return false;
    });
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === 'date') {
      // Safely get the most recent outreach for each contact
      const getLatestDate = (contact: any) => {
        if (!contact.outreachHistory || !Array.isArray(contact.outreachHistory) || contact.outreachHistory.length === 0) {
          return contact.lastContact || '';
        }
        return contact.outreachHistory.sort((x: any, y: any) => 
          new Date(y.date).getTime() - new Date(x.date).getTime()
        )[0]?.date || '';
      };
      
      const latestA = getLatestDate(a);
      const latestB = getLatestDate(b);
      
      return sortOrder === 'desc' 
        ? new Date(latestB).getTime() - new Date(latestA).getTime()
        : new Date(latestA).getTime() - new Date(latestB).getTime();
    } else if (sortBy === 'name') {
      return sortOrder === 'desc'
        ? b.name.localeCompare(a.name)
        : a.name.localeCompare(b.name);
    } else if (sortBy === 'company') {
      return sortOrder === 'desc'
        ? b.company.localeCompare(a.company)
        : a.company.localeCompare(b.company);
    }
    return 0;
  });

  // Analytics data
  const analyticsData = {
    // Email performance data
    emailPerformance: [
      { name: 'Sent', value: 32 },
      { name: 'Opened', value: 24 },
      { name: 'Replied', value: 14 },
      { name: 'Meetings', value: 8 },
    ],
    
    // Response rate over time
    responseRateOverTime: [
      { month: 'Jan', rate: 25 },
      { month: 'Feb', rate: 28 },
      { month: 'Mar', rate: 32 },
      { month: 'Apr', rate: 38 },
      { month: 'May', rate: 42 },
      { month: 'Jun', rate: 47 },
    ],
    
    // Engagement by industry
    engagementByIndustry: [
      { industry: 'Technology', interested: 65, neutral: 25, notInterested: 10 },
      { industry: 'Manufacturing', interested: 48, neutral: 32, notInterested: 20 },
      { industry: 'Retail', interested: 52, neutral: 28, notInterested: 20 },
      { industry: 'Healthcare', interested: 70, neutral: 20, notInterested: 10 },
      { industry: 'Education', interested: 58, neutral: 30, notInterested: 12 },
    ],
    
    // Conversion funnel
    conversionFunnel: [
      { stage: 'Contacted', count: 100 },
      { stage: 'Engaged', count: 68 },
      { stage: 'Meeting', count: 42 },
      { stage: 'Proposal', count: 28 },
      { stage: 'Closed', count: 18 },
    ],
    
    // Follow-up effectiveness
    followUpEffectiveness: [
      { followUps: '0', conversionRate: 12 },
      { followUps: '1', conversionRate: 24 },
      { followUps: '2', conversionRate: 38 },
      { followUps: '3', conversionRate: 45 },
      { followUps: '4+', conversionRate: 52 },
    ],
    
    // Response time distribution
    responseTimeDistribution: [
      { time: 'Same day', percentage: 35 },
      { time: '1-2 days', percentage: 42 },
      { time: '3-7 days', percentage: 15 },
      { time: '1-2 weeks', percentage: 5 },
      { time: '2+ weeks', percentage: 3 },
    ]
  };
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const AnalyticsCard = ({ 
    title, 
    icon, 
    children, 
    gradient = 'from-green-500 to-emerald-600',
    hoverGradient = 'from-green-600 to-emerald-700'
  }: { 
    title: string; 
    icon: React.ReactNode; 
    children: React.ReactNode;
    gradient?: string;
    hoverGradient?: string;
  }) => {
    return (
      <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-orange-500/15 p-4 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className={`bg-gradient-to-br ${gradient} p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300`}>
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        {children}
      </div>
    );
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon, 
    colorClass,
    trend = 'up'
  }: { 
    title: string; 
    value: string; 
    change?: string;
    icon: React.ReactNode;
    colorClass: string;
    trend?: 'up' | 'down' | 'flat';
  }) => {
    return (
      <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-orange-500/15 p-4 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-white/60 mb-1">{title}</p>
              <h3 className="text-2xl font-bold text-white">{value}</h3>
            </div>
            <div className={`rounded-xl p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 ${colorClass} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              {icon}
            </div>
          </div>
          {change && (
            <div className="flex items-center gap-1 text-sm font-medium">
              {trend === 'up' ? (
                <MdOutlineTrendingUp className="text-green-500" />
              ) : trend === 'down' ? (
                <MdOutlineTrendingDown className="text-red-500" />
              ) : (
                <MdOutlineTrendingFlat className="text-yellow-500" />
              )}
              <span className={trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-yellow-500'}>
                {change}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const ContactCard = ({ contact }: { contact: any }) => {
    return (
      <div className="backdrop-blur-lg bg-gradient-to-br from-[#28292b]/80 to-[rgba(40,41,43,0.2)] dark:from-gray-900/80 dark:to-gray-900/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-green-500/10 hover:border-green-500/20 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-black/30 group">
        <div className="flex flex-col h-full">
          {/* Contact header */}
          <div className="flex items-start justify-between pb-4 border-b border-gray-700/20 mb-4">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                {/* Profile image with status indicator */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-600/30 flex items-center justify-center text-white font-semibold text-xl border border-white/10 overflow-hidden shadow-md">
                  {contact.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
                <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-gray-800 ${
                  contact.status === "Engaged" ? "bg-green-500" 
                  : contact.status === "Evaluating" ? "bg-blue-500"
                  : contact.status === "New" ? "bg-yellow-500"
                  : "bg-red-500"
                }`}></div>
              </div>
              <div>
                <h3 className="font-semibold text-white">{contact.name}</h3>
                <p className="text-white/60 text-sm flex items-center gap-1.5">
                  <MdOutlinePerson className="text-white/40" size={14} />
                  {contact.position}
                </p>
              </div>
            </div>
            <div className="flex gap-1.5">
              <button className="p-1.5 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                <MdOutlineEmail size={18} />
              </button>
              <button className="p-1.5 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                <MdPhone size={18} />
              </button>
              <button className="p-1.5 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                <MdOutlineMoreVert size={18} />
              </button>
            </div>
          </div>
          
          {/* Contact details */}
          <div className="space-y-3 flex-grow mb-4">
            <div className="flex items-center gap-2">
              <MdOutlineBusiness className="text-white/40" />
              <span className="text-white/80 text-sm">{contact.company}</span>
            </div>
            <div className="flex items-center gap-2">
              <MdOutlineLocationOn className="text-white/40" />
              <span className="text-white/80 text-sm">{contact.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <MdOutlineTag className="text-white/40" />
              <div className="flex gap-1.5 flex-wrap">
                {contact.tags.map((tag: string, index: number) => (
                  <span 
                    key={index}
                    className={`text-xs py-0.5 px-2 rounded-full ${
                      tag.includes('SAP') || tag.includes('Hot Lead') || tag.includes('Decision Maker')
                        ? 'bg-green-500/20 text-green-300'
                        : tag.includes('Prospect') 
                        ? 'bg-blue-500/20 text-blue-300'
                        : tag.includes('Evaluating')
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-gray-500/20 text-gray-300'
                    }`}
                  >
                    {tag}
                          </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Outreach history */}
          <div className="mt-auto">
            <div className="flex items-center justify-between border-t border-gray-700/20 pt-4">
              <div>
                <div className="flex items-center gap-1.5">
                  <FaRegClock className="text-white/40" size={14} />
                  <span className="text-white/60 text-xs">Last Contact:</span>
                </div>
                <p className="text-white text-sm font-medium">{contact.lastContact}</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <FaRegLightbulb className="text-white/40" size={14} />
                  <span className="text-white/60 text-xs">Lead Score:</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-full bg-gray-700/30 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${
                      contact.leadScore >= 80 ? 'bg-green-500' 
                      : contact.leadScore >= 60 ? 'bg-blue-500'
                      : contact.leadScore >= 40 ? 'bg-yellow-500'
                      : 'bg-red-500'
                    }`} style={{ width: `${contact.leadScore}%` }}></div>
                  </div>
                  <span className="text-white font-medium text-sm">{contact.leadScore}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Sample metrics data - updated with more realistic values
  const metricsData = {
    sequenceStarted: 3784,
    openRate: {
      percentage: 42,
      count: 1589
    },
    clickRate: {
      percentage: 18,
      count: 681
    },
    replyRate: {
      percentage: 15.3,
      count: 579
    },
    opportunities: {
      count: 47,
      value: 5287000
    },
    timelineData: [
      { date: 'Jan 4', sent: 150, totalOpens: 71, uniqueOpens: 63, totalReplies: 23, totalClicks: 27, uniqueClicks: 25, opportunities: 2 },
      { date: 'Jan 11', sent: 168, totalOpens: 81, uniqueOpens: 71, totalReplies: 26, totalClicks: 31, uniqueClicks: 28, opportunities: 3 },
      { date: 'Jan 18', sent: 182, totalOpens: 89, uniqueOpens: 77, totalReplies: 28, totalClicks: 35, uniqueClicks: 30, opportunities: 3 },
      { date: 'Jan 25', sent: 195, totalOpens: 96, uniqueOpens: 82, totalReplies: 30, totalClicks: 37, uniqueClicks: 32, opportunities: 3 },
      { date: 'Feb 1', sent: 210, totalOpens: 105, uniqueOpens: 88, totalReplies: 32, totalClicks: 40, uniqueClicks: 35, opportunities: 3 },
      { date: 'Feb 8', sent: 225, totalOpens: 112, uniqueOpens: 95, totalReplies: 34, totalClicks: 43, uniqueClicks: 37, opportunities: 4 },
      { date: 'Feb 15', sent: 243, totalOpens: 122, uniqueOpens: 102, totalReplies: 36, totalClicks: 46, uniqueClicks: 40, opportunities: 4 },
      { date: 'Feb 22', sent: 261, totalOpens: 132, uniqueOpens: 109, totalReplies: 39, totalClicks: 50, uniqueClicks: 43, opportunities: 4 },
      { date: 'Mar 1', sent: 280, totalOpens: 142, uniqueOpens: 117, totalReplies: 42, totalClicks: 54, uniqueClicks: 46, opportunities: 5 },
      { date: 'Mar 8', sent: 298, totalOpens: 152, uniqueOpens: 125, totalReplies: 45, totalClicks: 57, uniqueClicks: 49, opportunities: 5 },
      { date: 'Mar 15', sent: 317, totalOpens: 162, uniqueOpens: 133, totalReplies: 48, totalClicks: 61, uniqueClicks: 52, opportunities: 5 },
      { date: 'Mar 22', sent: 335, totalOpens: 171, uniqueOpens: 141, totalReplies: 51, totalClicks: 64, uniqueClicks: 55, opportunities: 6 }
    ]
  };

  const MetricCard = ({ 
    title, 
    value, 
    subValue,
    icon,
    colorClass = 'text-green-500'
  }: { 
    title: string;
    value: string | number;
    subValue?: string | number;
    icon: React.ReactNode;
    colorClass?: string;
  }) => {
    return (
      <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-green-500/15 p-4 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className={`${colorClass} text-2xl`}>{icon}</span>
            <h3 className="text-sm font-medium text-white/60">{title}</h3>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{value}</span>
            {subValue && (
              <span className="text-white/60">| {subValue}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Generate additional contact data for demo purposes
  const generateAdditionalContacts = () => {
    return expandedContacts.map(contact => ({
      ...contact
    }));
  };

  const displayContacts = generateAdditionalContacts();

  // Update the campaign performance data with more realistic variations
  const campaignPerformanceData = [
    { date: '2024-03-01', emailsSent: 1250, uniqueOpens: 875, replies: 245, opportunities: 12 },
    { date: '2024-03-02', emailsSent: 3420, uniqueOpens: 2320, replies: 912, opportunities: 45 },
    { date: '2024-03-03', emailsSent: 2680, uniqueOpens: 1645, replies: 578, opportunities: 28 },
    { date: '2024-03-04', emailsSent: 4380, uniqueOpens: 3240, replies: 1425, opportunities: 72 },
    { date: '2024-03-05', emailsSent: 3920, uniqueOpens: 2980, replies: 1312, opportunities: 58 },
    { date: '2024-03-06', emailsSent: 5450, uniqueOpens: 3980, replies: 1845, opportunities: 96 },
    { date: '2024-03-07', emailsSent: 4780, uniqueOpens: 3320, replies: 1468, opportunities: 75 },
    { date: '2024-03-08', emailsSent: 2100, uniqueOpens: 1680, replies: 625, opportunities: 32 },
    { date: '2024-03-09', emailsSent: 3650, uniqueOpens: 2620, replies: 1198, opportunities: 58 },
    { date: '2024-03-10', emailsSent: 5880, uniqueOpens: 4420, replies: 2512, opportunities: 128 },
    { date: '2024-03-11', emailsSent: 4250, uniqueOpens: 3820, replies: 1685, opportunities: 85 },
    { date: '2024-03-12', emailsSent: 2980, uniqueOpens: 2520, replies: 1045, opportunities: 50 },
    { date: '2024-03-13', emailsSent: 5120, uniqueOpens: 3680, replies: 2012, opportunities: 102 },
    { date: '2024-03-14', emailsSent: 3450, uniqueOpens: 2580, replies: 1225, opportunities: 63 },
    { date: '2024-03-15', emailsSent: 4280, uniqueOpens: 3220, replies: 1685, opportunities: 85 }
  ];

  // Add master inbox data
  const masterInboxData = [
    {
      id: 1,
      from: "Jeff Levy",
      email: "j.levy@example.com",
      company: "Apple",
      subject: "Re: Solar Energy Proposal",
      message: "Thank you for the detailed proposal. We're very interested in exploring this further. Could you provide more information about the installation timeline?",
      receivedAt: "2024-03-15T10:30:00",
      status: "unread",
      aiSuggestion: "I recommend responding with a detailed timeline breakdown and offering to schedule a site visit. This shows proactive engagement and addresses their specific concern.",
      aiResponse: "Hi Jeff,\n\nThank you for your interest! I'd be happy to walk you through our typical installation timeline:\n\n1. Site Assessment: 1-2 weeks\n2. Design & Permitting: 2-3 weeks\n3. Installation: 4-6 weeks\n4. Inspection & Activation: 1-2 weeks\n\nWould you like to schedule a site visit to discuss this in more detail?\n\nBest regards,\n[Your Name]"
    },
    {
      id: 2,
      from: "Amy Huke",
      email: "a.huke@example.com",
      company: "Honeywell",
      subject: "Re: Independent Research",
      message: "The energy savings projections look promising. What's your experience with similar facilities in our industry?",
      receivedAt: "2024-03-15T09:15:00",
      status: "read",
      aiSuggestion: "Share specific case studies from similar facilities in their industry to build credibility and address their concern about industry-specific experience.",
      aiResponse: "Hi Amy,\n\nWe've successfully implemented solar solutions for several manufacturing facilities in your industry. For example, we recently completed a 2.5MW installation for a similar facility that's projected to save them $450,000 annually.\n\nWould you be interested in speaking with their facilities manager about their experience?\n\nBest regards,\n[Your Name]"
    }
  ];

  // After all the state and setup code, inside the component but before the JSX return

  // Channel-specific analytics data
  const emailAnalytics = {
    metrics: {
      sent: 8456,
      opened: 3782,
      clicked: 1893,
      responded: 872,
      meetings: 143
    },
    performance: [
      { name: "Mon", sent: 412, opened: 186, clicked: 87 },
      { name: "Tue", sent: 428, opened: 201, clicked: 96 },
      { name: "Wed", sent: 456, opened: 234, clicked: 124 },
      { name: "Thu", sent: 423, opened: 187, clicked: 84 },
      { name: "Fri", sent: 401, opened: 167, clicked: 76 },
      { name: "Sat", sent: 89, opened: 12, clicked: 5 },
      { name: "Sun", sent: 67, opened: 8, clicked: 2 }
    ],
    openRates: [
      { name: "Week 1", rate: 42 },
      { name: "Week 2", rate: 45 },
      { name: "Week 3", rate: 47 },
      { name: "Week 4", rate: 44 },
      { name: "Week 5", rate: 48 },
      { name: "Week 6", rate: 51 }
    ],
    byTime: [
      { time: "8am", rate: 32 },
      { time: "10am", rate: 45 },
      { time: "12pm", rate: 43 },
      { time: "2pm", rate: 47 },
      { time: "4pm", rate: 41 },
      { time: "6pm", rate: 28 }
    ]
  };

  const linkedinAnalytics = {
    metrics: {
      connections: 1245,
      messages: 867,
      responses: 392,
      meetings: 87
    },
    performance: [
      { name: "Mon", sent: 89, accepted: 32, responded: 24 },
      { name: "Tue", sent: 94, accepted: 41, responded: 28 },
      { name: "Wed", sent: 112, accepted: 54, responded: 32 },
      { name: "Thu", sent: 87, accepted: 39, responded: 26 },
      { name: "Fri", sent: 76, accepted: 31, responded: 19 },
      { name: "Sat", sent: 12, accepted: 4, responded: 1 },
      { name: "Sun", sent: 8, accepted: 2, responded: 0 }
    ],
    byIndustry: [
      { industry: "IT", count: 423, rate: 47 },
      { industry: "Finance", count: 312, rate: 38 },
      { industry: "Manufacturing", count: 245, rate: 32 },
      { industry: "Healthcare", count: 187, rate: 29 },
      { industry: "Retail", count: 142, rate: 26 },
      { industry: "Other", count: 98, rate: 21 }
    ]
  };

  const whatsappAnalytics = {
    metrics: {
      sent: 1893,
      delivered: 1876,
      read: 1654,
      replied: 845,
      meetings: 67
    },
    performance: [
      { name: "Mon", sent: 178, read: 164, replied: 82 },
      { name: "Tue", sent: 184, read: 173, replied: 91 },
      { name: "Wed", sent: 197, read: 182, replied: 96 },
      { name: "Thu", sent: 176, read: 158, replied: 78 },
      { name: "Fri", sent: 158, read: 142, replied: 67 },
      { name: "Sat", sent: 34, read: 21, replied: 9 },
      { name: "Sun", sent: 28, read: 19, replied: 7 }
    ],
    byTime: [
      { time: "8am-10am", count: 234, rate: 38 },
      { time: "10am-12pm", count: 312, rate: 45 },
      { time: "12pm-2pm", count: 287, rate: 41 },
      { time: "2pm-4pm", count: 342, rate: 48 },
      { time: "4pm-6pm", count: 298, rate: 43 },
      { time: "6pm-8pm", count: 187, rate: 32 }
    ]
  };

  // Display channel-specific metrics based on active tab
  const getActiveChannelMetrics = () => {
    switch (activeTab) {
      case 'email':
        return emailAnalytics;
      case 'linkedin':
        return linkedinAnalytics;
      case 'whatsapp':
        return whatsappAnalytics;
      default:
        return emailAnalytics;
    }
  };

  // Get the appropriate icon for each channel
  const getChannelIcon = (channel: ChannelType) => {
    switch (channel) {
      case 'email':
        return <MdOutlineEmail className="text-xl" />;
      case 'linkedin':
        return <FaLinkedin className="text-xl" />;
      case 'whatsapp':
        return <FaWhatsapp className="text-xl" />;
      default:
        return <MdOutlineEmail className="text-xl" />;
    }
  };

  // Get the channel name with proper formatting
  const getChannelName = (channel: ChannelType) => {
    switch (channel) {
      case 'email':
        return 'Email';
      case 'linkedin':
        return 'LinkedIn';
      case 'whatsapp':
        return 'WhatsApp';
      default:
        return 'Email';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020305] flex items-center justify-center relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="fixed top-20 right-40 w-96 h-96 bg-gradient-to-br from-green-500/5 to-transparent rounded-full blur-3xl transform rotate-12 opacity-70 pointer-events-none"></div>
        <div className="fixed bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-green-500/5 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-60 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="loading loading-spinner loading-lg text-green-500 relative"></div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Loading Analytics</h2>
            <p className="text-white/60">Preparing your outreach insights...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-1 py-2 bg-[#020305] min-h-screen min-w-full relative">
      {/* Background gradient orbs */}
      <div className="fixed top-20 right-40 w-96 h-96 bg-gradient-to-br from-green-500/5 to-transparent rounded-full blur-3xl transform rotate-12 opacity-70 pointer-events-none"></div>
      <div className="fixed bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-green-500/5 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-60 pointer-events-none"></div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Simple Header */}
          <div className="pt-4 pb-8">
            <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
              Campaign Analytics
            </h1>
            <p className="text-white/60 mt-2">Monitor performance and engagement of your SAP migration outreach campaigns</p>
          </div>

          {/* Channel Tabs */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Email Tab */}
            <button
              onClick={() => setActiveTab('email')}
              className={`backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-green-500/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 ${
                activeTab === 'email' ? 'ring-2 ring-green-500' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                  <MdOutlineEmail size={24} />
          </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Email Outreach</h2>
                  <p className="text-white/60 text-sm">SAP migration email campaigns</p>
                </div>
                  </div>
            </button>

            {/* LinkedIn Tab */}
            <button
              onClick={() => setActiveTab('linkedin')}
              className={`backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-[#0A66C2]/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 ${
                activeTab === 'linkedin' ? 'ring-2 ring-[#0A66C2]' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-[#0A66C2] to-[#0A66C2]/80 p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                  <FaLinkedin size={24} />
                  </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">LinkedIn Outreach</h2>
                  <p className="text-white/60 text-sm">B2B SAP professional targeting</p>
                  </div>
                  </div>
            </button>

            {/* WhatsApp Tab */}
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-[#25D366]/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 ${
                activeTab === 'whatsapp' ? 'ring-2 ring-[#25D366]' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-[#25D366] to-[#25D366]/80 p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                  <FaWhatsapp size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">WhatsApp Outreach</h2>
                  <p className="text-white/60 text-sm">Direct messaging for key contacts</p>
                </div>
              </div>
            </button>
              </div>
              
          {/* Channel Content */}
          <div className="grid grid-cols-12 gap-6">
            {/* Channel Analytics Dashboard */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {/* Email Content */}
              {activeTab === 'email' && (
                <>
                  {/* Email Performance Overview */}
                  <AnalyticsCard
                    title="Email Campaign Performance"
                    icon={<MdOutlineBarChart />}
                  >
                    <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={emailAnalytics.performance}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                          <XAxis dataKey="name" stroke="#B3B3B3" />
                          <YAxis stroke="#B3B3B3" />
                    <Tooltip 
                      contentStyle={{ 
                              backgroundColor: 'rgba(10, 10, 10, 0.8)',
                              borderRadius: '0.5rem',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                              color: 'white',
                            }}
                          />
                          <Legend />
                          <Bar dataKey="sent" name="Sent" fill="#10B981" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="opened" name="Opened" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="clicked" name="Clicked" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </AnalyticsCard>

                  {/* Email Open Rate Trend */}
                  <AnalyticsCard
                    title="Open Rate Trend"
                    icon={<MdOutlineShowChart />}
                    gradient="from-blue-500 to-blue-600"
                    hoverGradient="from-blue-600 to-blue-700"
                  >
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={emailAnalytics.openRates}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                          <XAxis dataKey="name" stroke="#B3B3B3" />
                          <YAxis stroke="#B3B3B3" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(10, 10, 10, 0.8)',
                        borderRadius: '0.5rem',
                              border: '1px solid rgba(59, 130, 246, 0.2)',
                              color: 'white',
                      }}
                            formatter={(value) => [`${value}%`, 'Open Rate']}
                    />
                          <Line
                      type="monotone" 
                            dataKey="rate"
                      stroke="#3B82F6" 
                            strokeWidth={3}
                            dot={{ r: 4, fill: "#3B82F6", strokeWidth: 2, stroke: "rgba(59, 130, 246, 0.4)" }}
                            activeDot={{ r: 6, fill: "#3B82F6", strokeWidth: 2, stroke: "white" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </AnalyticsCard>

                  {/* Time of Day Performance */}
                  <AnalyticsCard
                    title="Time of Day Effectiveness"
                    icon={<MdOutlineAccessTime />}
                    gradient="from-purple-500 to-purple-600"
                    hoverGradient="from-purple-600 to-purple-700"
                  >
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={emailAnalytics.byTime}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                          <XAxis dataKey="time" stroke="#B3B3B3" />
                          <YAxis stroke="#B3B3B3" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(10, 10, 10, 0.8)',
                              borderRadius: '0.5rem',
                              border: '1px solid rgba(139, 92, 246, 0.2)',
                              color: 'white',
                            }}
                            formatter={(value) => [`${value}%`, 'Open Rate']}
                          />
                          <Bar
                            dataKey="rate"
                            name="Open Rate"
                            fill="#8B5CF6"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </AnalyticsCard>
                </>
              )}

              {/* LinkedIn Content */}
              {activeTab === 'linkedin' && (
                <>
                  {/* LinkedIn Connection Performance */}
                  <AnalyticsCard
                    title="LinkedIn Campaign Performance"
                    icon={<MdOutlineBarChart />}
                    gradient="from-[#0A66C2] to-[#0077B5]"
                    hoverGradient="from-[#0077B5] to-[#0A66C2]"
                  >
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={linkedinAnalytics.performance}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                          <XAxis dataKey="name" stroke="#B3B3B3" />
                          <YAxis stroke="#B3B3B3" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(10, 10, 10, 0.8)',
                              borderRadius: '0.5rem',
                              border: '1px solid rgba(10, 102, 194, 0.2)',
                              color: 'white',
                            }}
                          />
                          <Legend />
                          <Bar dataKey="sent" name="Connection Requests" fill="#0A66C2" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="accepted" name="Accepted" fill="#10B981" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="responded" name="Responded" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </AnalyticsCard>

                  {/* Industry Performance */}
                  <AnalyticsCard
                    title="Industry Acceptance Rates"
                    icon={<MdOutlineBusiness />}
                    gradient="from-[#0A66C2] to-[#0077B5]"
                    hoverGradient="from-[#0077B5] to-[#0A66C2]"
                  >
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={linkedinAnalytics.byIndustry}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                          <XAxis type="number" stroke="#B3B3B3" />
                          <YAxis dataKey="industry" type="category" stroke="#B3B3B3" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(10, 10, 10, 0.8)',
                              borderRadius: '0.5rem',
                              border: '1px solid rgba(10, 102, 194, 0.2)',
                              color: 'white',
                            }}
                            formatter={(value, name) => [name === 'rate' ? `${value}%` : value, name === 'rate' ? 'Acceptance Rate' : 'Connections']}
                          />
                          <Legend />
                          <Bar dataKey="count" name="Connections" fill="#0A66C2" radius={[0, 4, 4, 0]} />
                          <Bar dataKey="rate" name="Acceptance Rate (%)" fill="#10B981" radius={[0, 4, 4, 0]} />
                        </BarChart>
                </ResponsiveContainer>
              </div>
                  </AnalyticsCard>
                </>
              )}

              {/* WhatsApp Content */}
              {activeTab === 'whatsapp' && (
                <>
                  {/* WhatsApp Message Performance */}
                  <AnalyticsCard
                    title="WhatsApp Campaign Performance"
                    icon={<MdOutlineBarChart />}
                    gradient="from-[#25D366] to-[#128C7E]"
                    hoverGradient="from-[#128C7E] to-[#25D366]"
                  >
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={whatsappAnalytics.performance}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                          <XAxis dataKey="name" stroke="#B3B3B3" />
                          <YAxis stroke="#B3B3B3" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(10, 10, 10, 0.8)',
                              borderRadius: '0.5rem',
                              border: '1px solid rgba(37, 211, 102, 0.2)',
                              color: 'white',
                            }}
                          />
                          <Legend />
                          <Bar dataKey="sent" name="Sent" fill="#25D366" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="read" name="Read" fill="#10B981" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="replied" name="Replied" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                </div>
                  </AnalyticsCard>

                  {/* Time of Day Performance for WhatsApp */}
                  <AnalyticsCard
                    title="Response Time Analysis"
                    icon={<MdOutlineAccessTime />}
                    gradient="from-[#25D366] to-[#128C7E]"
                    hoverGradient="from-[#128C7E] to-[#25D366]"
                  >
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={whatsappAnalytics.byTime}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                          <XAxis dataKey="time" stroke="#B3B3B3" />
                          <YAxis stroke="#B3B3B3" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(10, 10, 10, 0.8)',
                              borderRadius: '0.5rem',
                              border: '1px solid rgba(37, 211, 102, 0.2)',
                              color: 'white',
                            }}
                            formatter={(value, name) => [name === 'rate' ? `${value}%` : value, name === 'rate' ? 'Response Rate' : 'Messages']}
                          />
                          <Bar dataKey="count" name="Messages" fill="#25D366" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="rate" name="Response Rate (%)" fill="#10B981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                </div>
                  </AnalyticsCard>
                </>
              )}
          </div>

            {/* Sidebar with Stats */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 gap-4">
                {activeTab === 'email' && (
                  <>
                    <StatCard
                      title="Open Rate"
                      value={`${Math.round((emailAnalytics.metrics.opened / emailAnalytics.metrics.sent) * 100)}%`}
                      change="+5.2%"
                      icon={<MdOutlineOpenInNew />}
                      colorClass="text-green-500"
                      trend="up"
                    />
                    <StatCard
                      title="Click Rate"
                      value={`${Math.round((emailAnalytics.metrics.clicked / emailAnalytics.metrics.opened) * 100)}%`}
                      change="+2.8%"
                      icon={<MdOutlineMouse />}
                      colorClass="text-blue-500"
                      trend="up"
                    />
                    <StatCard
                      title="Response Rate"
                      value={`${Math.round((emailAnalytics.metrics.responded / emailAnalytics.metrics.sent) * 100)}%`}
                      change="+1.5%"
                      icon={<MdOutlineReply />}
                      colorClass="text-purple-500"
                      trend="up"
                    />
                    <StatCard
                      title="Meeting Conversion"
                      value={`${Math.round((emailAnalytics.metrics.meetings / emailAnalytics.metrics.responded) * 100)}%`}
                      change="+3.7%"
                      icon={<MdOutlineCalendarToday />}
                      colorClass="text-green-500"
                      trend="up"
                    />
                  </>
                )}

                {activeTab === 'linkedin' && (
                  <>
                    <StatCard
                      title="Connection Rate"
                      value={`${Math.round((linkedinAnalytics.metrics.connections / 3000) * 100)}%`}
                      change="+6.7%"
                      icon={<MdOutlineGroups />}
                      colorClass="text-[#0A66C2]"
                      trend="up"
                    />
                    <StatCard
                      title="Message Rate"
                      value={`${Math.round((linkedinAnalytics.metrics.messages / linkedinAnalytics.metrics.connections) * 100)}%`}
                      change="+4.2%"
                      icon={<MdOutlineChat />}
                      colorClass="text-green-500"
                      trend="up"
                    />
                    <StatCard
                      title="Response Rate"
                      value={`${Math.round((linkedinAnalytics.metrics.responses / linkedinAnalytics.metrics.messages) * 100)}%`}
                      change="+2.5%"
                      icon={<MdOutlineReply />}
                      colorClass="text-blue-500"
                      trend="up"
                    />
                    <StatCard
                      title="Meeting Conversion"
                      value={`${Math.round((linkedinAnalytics.metrics.meetings / linkedinAnalytics.metrics.responses) * 100)}%`}
                      change="+7.3%"
                      icon={<MdOutlineCalendarToday />}
                      colorClass="text-green-500"
                      trend="up"
                    />
                  </>
                )}

                {activeTab === 'whatsapp' && (
                  <>
                    <StatCard
                      title="Delivery Rate"
                      value={`${Math.round((whatsappAnalytics.metrics.delivered / whatsappAnalytics.metrics.sent) * 100)}%`}
                      change="+0.9%"
                      icon={<MdCheck />}
                      colorClass="text-[#25D366]"
                      trend="up"
                    />
                    <StatCard
                      title="Read Rate"
                      value={`${Math.round((whatsappAnalytics.metrics.read / whatsappAnalytics.metrics.delivered) * 100)}%`}
                      change="+5.1%"
                      icon={<MdOutlineOpenInNew />}
                      colorClass="text-green-500"
                      trend="up"
                    />
                    <StatCard
                      title="Response Rate"
                      value={`${Math.round((whatsappAnalytics.metrics.replied / whatsappAnalytics.metrics.read) * 100)}%`}
                      change="+3.5%"
                      icon={<MdOutlineReply />}
                      colorClass="text-blue-500"
                      trend="up"
                    />
                    <StatCard
                      title="Meeting Conversion"
                      value={`${Math.round((whatsappAnalytics.metrics.meetings / whatsappAnalytics.metrics.replied) * 100)}%`}
                      change="+2.1%"
                      icon={<MdOutlineCalendarToday />}
                      colorClass="text-green-500"
                      trend="up"
                    />
                  </>
                )}
              </div>
              
              {/* Campaign Status Summary */}
              <AnalyticsCard
                title={`${getChannelName(activeTab)} Campaign Status`}
                icon={getChannelIcon(activeTab)}
                gradient={
                  activeTab === 'email' 
                    ? 'from-green-500 to-emerald-600' 
                    : activeTab === 'linkedin' 
                    ? 'from-[#0A66C2] to-[#0077B5]'
                    : 'from-[#25D366] to-[#128C7E]'
                }
                hoverGradient={
                  activeTab === 'email' 
                    ? 'from-green-600 to-emerald-700' 
                    : activeTab === 'linkedin' 
                    ? 'from-[#0077B5] to-[#0A66C2]'
                    : 'from-[#128C7E] to-[#25D366]'
                }
              >
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Engaged', value: 42 },
                          { name: 'Responded', value: 23 },
                          { name: 'Not Engaged', value: 35 },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        <Cell fill="#10B981" />
                        <Cell fill="#3B82F6" />
                        <Cell fill="#4B5563" />
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(10, 10, 10, 0.8)',
                          borderRadius: '0.5rem',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                          color: 'white',
                      }}
                      formatter={(value) => [`${value}%`, 'Percentage']}
                    />
                    </PieChart>
                </ResponsiveContainer>
              </div>
              </AnalyticsCard>
            </div>
          </div>

          {/* Contacts Database Section */}
          <div className="mt-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">SAP Prospect Database</h2>
              <div className="flex gap-2">
            <button 
              onClick={() => setShowContacts(!showContacts)}
                  className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg flex items-center gap-2 border border-green-500/10 transition-all"
                >
                  {showContacts ? <MdExpandLess /> : <MdExpandMore />}
                  {showContacts ? 'Hide Contacts' : 'Show Contacts'}
                </button>
                <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-green-500/20 transition-all">
                  <MdOutlinePersonAdd />
                  Add Contact
            </button>
              </div>
          </div>

              {/* Filters and search */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-green-500/15 p-4 relative overflow-hidden">
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="relative">
                    <input 
                      type="text" 
                    placeholder="Search SAP contacts..." 
                    className="input input-sm backdrop-blur-md bg-[#28292b]/60 border border-green-500/20 text-white focus:border-green-500 pl-10 w-64"
                    />
                  <MdOutlineEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                  </div>
                  
                  <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-sm bg-transparent hover:bg-green-500/10 border border-green-500/30 text-white transition-colors gap-1">
                      <MdFilterList size={16} />
                      Filter: {filterStatus === 'all' ? 'All Contacts' : 
                        filterStatus === 'interested' ? 'Engaged' :
                        filterStatus === 'not_interested' ? 'Not Interested' :
                        filterStatus === 'no_response' ? 'No Response' : 'Evaluating'}
                    </label>
                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/90 via-[#28292b]/90 to-[rgba(40,41,43,0.9)] shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-green-500/15 rounded-box w-52">
                    <li><button onClick={() => setFilterStatus('all')} className="text-white hover:bg-green-500/10">All Contacts</button></li>
                    <li><button onClick={() => setFilterStatus('interested')} className="text-white hover:bg-green-500/10">Engaged</button></li>
                    <li><button onClick={() => setFilterStatus('not_interested')} className="text-white hover:bg-green-500/10">Not Interested</button></li>
                    <li><button onClick={() => setFilterStatus('no_response')} className="text-white hover:bg-green-500/10">No Response</button></li>
                    <li><button onClick={() => setFilterStatus('pending')} className="text-white hover:bg-green-500/10">Evaluating</button></li>
                    </ul>
                  </div>
                  
                  <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-sm bg-transparent hover:bg-green-500/10 border border-green-500/30 text-white transition-colors gap-1">
                      <MdSort size={16} />
                      Sort: {sortBy === 'date' ? 'Last Contact' : 
                        sortBy === 'name' ? 'Name' : 
                        sortBy === 'company' ? 'Company' : 
                        sortBy === 'score' ? 'Lead Score' : 'Status'} 
                      ({sortOrder === 'desc' ? '↓' : '↑'})
                    </label>
                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/90 via-[#28292b]/90 to-[rgba(40,41,43,0.9)] shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-green-500/15 rounded-box w-52">
                    <li><button onClick={() => { setSortBy('date'); setSortOrder('desc'); }} className="text-white hover:bg-green-500/10">Latest First</button></li>
                    <li><button onClick={() => { setSortBy('date'); setSortOrder('asc'); }} className="text-white hover:bg-green-500/10">Oldest First</button></li>
                    <li><button onClick={() => { setSortBy('name'); setSortOrder('asc'); }} className="text-white hover:bg-green-500/10">Name (A-Z)</button></li>
                    <li><button onClick={() => { setSortBy('name'); setSortOrder('desc'); }} className="text-white hover:bg-green-500/10">Name (Z-A)</button></li>
                    <li><button onClick={() => { setSortBy('company'); setSortOrder('asc'); }} className="text-white hover:bg-green-500/10">Company (A-Z)</button></li>
                    <li><button onClick={() => { setSortBy('company'); setSortOrder('desc'); }} className="text-white hover:bg-green-500/10">Company (Z-A)</button></li>
                    <li><button onClick={() => { setSortBy('score'); setSortOrder('desc'); }} className="text-white hover:bg-green-500/10">Lead Score (High-Low)</button></li>
                    <li><button onClick={() => { setSortBy('status'); setSortOrder('asc'); }} className="text-white hover:bg-green-500/10">Status</button></li>
                    </ul>
                  </div>
                  
                  <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-sm bg-transparent hover:bg-green-500/10 border border-green-500/30 text-white transition-colors">
                      <MdOutlineMailOutline size={16} />
                      Columns
                    </label>
                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/90 via-[#28292b]/90 to-[rgba(40,41,43,0.9)] shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-green-500/15 rounded-box w-52">
                    <li><label className="flex items-center gap-2 p-2 text-white hover:bg-green-500/10">
                      <input type="checkbox" className="checkbox checkbox-xs checkbox-success" checked readOnly /> Name
                      </label></li>
                    <li><label className="flex items-center gap-2 p-2 text-white hover:bg-green-500/10">
                      <input type="checkbox" className="checkbox checkbox-xs checkbox-success" checked readOnly /> Email
                      </label></li>
                    <li><label className="flex items-center gap-2 p-2 text-white hover:bg-green-500/10">
                      <input type="checkbox" className="checkbox checkbox-xs checkbox-success" checked readOnly /> Company
                      </label></li>
                    <li><label className="flex items-center gap-2 p-2 text-white hover:bg-green-500/10">
                      <input type="checkbox" className="checkbox checkbox-xs checkbox-success" checked readOnly /> Position
                      </label></li>
                    <li><label className="flex items-center gap-2 p-2 text-white hover:bg-green-500/10">
                      <input type="checkbox" className="checkbox checkbox-xs checkbox-success" checked readOnly /> Location
                      </label></li>
                    <li><label className="flex items-center gap-2 p-2 text-white hover:bg-green-500/10">
                      <input type="checkbox" className="checkbox checkbox-xs checkbox-success" checked readOnly /> Status
                      </label></li>
                    <li><label className="flex items-center gap-2 p-2 text-white hover:bg-green-500/10">
                      <input type="checkbox" className="checkbox checkbox-xs checkbox-success" checked readOnly /> Last Contact
                      </label></li>
                    <li><label className="flex items-center gap-2 p-2 text-white hover:bg-green-500/10">
                      <input type="checkbox" className="checkbox checkbox-xs checkbox-success" /> Tags
                      </label></li>
                    <li><label className="flex items-center gap-2 p-2 text-white hover:bg-green-500/10">
                      <input type="checkbox" className="checkbox checkbox-xs checkbox-success" /> Lead Score
                      </label></li>
                    </ul>
                  </div>
                  
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-white/60 text-sm">
                      Showing {(currentPage - 1) * rowsPerPage + 1}-{Math.min(currentPage * rowsPerPage, totalContacts)} of {totalContacts.toLocaleString()} contacts
                    </span>
                    <div className="dropdown dropdown-end">
                      <label tabIndex={0} className="btn btn-sm bg-transparent hover:bg-green-500/10 border border-green-500/30 text-white transition-colors">
                        {rowsPerPage} per page
                      </label>
                      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/90 via-[#28292b]/90 to-[rgba(40,41,43,0.9)] shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-green-500/15 rounded-box w-40">
                        <li><button onClick={() => setRowsPerPage(10)} className="text-white hover:bg-green-500/10">10 rows</button></li>
                        <li><button onClick={() => setRowsPerPage(25)} className="text-white hover:bg-green-500/10">25 rows</button></li>
                        <li><button onClick={() => setRowsPerPage(50)} className="text-white hover:bg-green-500/10">50 rows</button></li>
                        <li><button onClick={() => setRowsPerPage(100)} className="text-white hover:bg-green-500/10">100 rows</button></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact data table */}
              <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-green-500/15 p-2 relative overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="table table-sm w-full">
                    {/* Table header */}
                    <thead>
                      <tr className="border-b border-green-500/20">
                        <th className="bg-[#28292b]/80 text-white/80 pl-3 rounded-tl-lg">#</th>
                        <th className="bg-[#28292b]/80 text-white/80">Name</th>
                        <th className="bg-[#28292b]/80 text-white/80">Email</th>
                        <th className="bg-[#28292b]/80 text-white/80">Company</th>
                        <th className="bg-[#28292b]/80 text-white/80">Position</th>
                        <th className="bg-[#28292b]/80 text-white/80">Location</th>
                        <th className="bg-[#28292b]/80 text-white/80">Status</th>
                        <th className="bg-[#28292b]/80 text-white/80">Last Contact</th>
                        <th className="bg-[#28292b]/80 text-white/80 rounded-tr-lg">Actions</th>
                      </tr>
                    </thead>
                    {/* Table body */}
                    <tbody>
                      {displayContacts.map((contact, index) => (
                        <tr key={index} className="hover:bg-[#28292b]/40 border-b border-emerald-500/10">
                          <td className="px-3">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                          <td className="font-medium">{contact.name}</td>
                          <td className="text-white/80">{contact.email}</td>
                          <td>{contact.company}</td>
                          <td className="text-white/80">{contact.position}</td>
                          <td className="text-white/80">{contact.location}</td>
                          <td>
                            <span className={`px-2 py-1 rounded-full text-xs 
                              ${contact.status === 'Engaged' ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 
                                contact.status === 'New' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' : 
                                contact.status === 'Not Interested' ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 
                                'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'}`}>
                              {contact.status}
                            </span>
                          </td>
                          <td className="text-white/80">{contact.lastContact}</td>
                          <td>
                            <div className="flex items-center gap-2">
                              <button className="btn btn-xs btn-circle bg-transparent hover:bg-orange-500/10 border border-orange-500/30">
                                <MdOutlineEmail className="text-orange-500" size={14} />
                              </button>
                              <button className="btn btn-xs btn-circle bg-transparent hover:bg-orange-500/10 border border-orange-500/30">
                                <MdPhone className="text-orange-500" size={14} />
                              </button>
                              <button className="btn btn-xs btn-circle bg-transparent hover:bg-orange-500/10 border border-orange-500/30">
                                <MdNotes className="text-orange-500" size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Enhanced pagination */}
                <div className="flex justify-between items-center mt-6 px-2">
                  <div className="flex items-center gap-2">
                    <button 
                      className="btn btn-sm btn-circle bg-transparent hover:bg-orange-500/10 border border-orange-500/30 text-white disabled:opacity-30"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(1)}
                    >
                      «
                    </button>
                    <button 
                      className="btn btn-sm btn-circle bg-transparent hover:bg-orange-500/10 border border-orange-500/30 text-white disabled:opacity-30"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    >
                      <MdChevronLeft />
                    </button>
                    
                    {/* Show pagination numbers based on current page */}
                    {Array.from({ length: 9 }, (_, i) => {
                      // Create a range of page numbers centered around current page
                      const pageNum = currentPage <= 4 ? i + 1 :
                                     currentPage >= totalPages - 4 ? totalPages - 8 + i :
                                     currentPage - 4 + i;
                      
                      // Only show if within valid range
                      if (pageNum > 0 && pageNum <= totalPages) {
                        return (
                          <button 
                            key={i} 
                            className={`btn btn-sm btn-circle ${pageNum === currentPage ? 'bg-orange-500 text-white' : 'bg-transparent hover:bg-orange-500/10 border border-orange-500/30 text-white'}`}
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                      return null;
                    })}
                    
                    {currentPage < totalPages - 5 && (
                      <span className="px-1 text-white/60">...</span>
                    )}
                    
                    {currentPage < totalPages - 5 && (
                      <button 
                        className="btn btn-sm btn-circle bg-transparent hover:bg-orange-500/10 border border-orange-500/30 text-white"
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </button>
                    )}
                    
                    <button 
                      className="btn btn-sm btn-circle bg-transparent hover:bg-orange-500/10 border border-orange-500/30 text-white disabled:opacity-30"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    >
                      <MdChevronRight />
                    </button>
                    <button 
                      className="btn btn-sm btn-circle bg-transparent hover:bg-orange-500/10 border border-orange-500/30 text-white disabled:opacity-30"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      »
                    </button>
                  </div>
                  
                  <div className="text-white/60 text-sm">
                    Jump to page:
                    <input 
                      type="number" 
                      min="1" 
                      max={totalPages}
                      value={currentPage}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value >= 1 && value <= totalPages) {
                          setCurrentPage(value);
                        }
                      }}
                      className="ml-2 input input-xs input-bordered w-14 bg-[#28292b]/60 border-emerald-500/30 text-white text-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Add Note Modal */}
          {showNoteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-emerald-500/15 p-6 w-full max-w-md relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="font-bold text-lg mb-4 text-white">
                    Add Note for {selectedContact?.name}
                  </h3>
                  <div className="form-control">
                    <textarea 
                      className="textarea backdrop-blur-md bg-[#28292b]/60 border border-emerald-500/20 text-white focus:border-emerald-500 h-32"
                      placeholder="Enter your note here..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button 
                      onClick={() => setShowNoteModal(false)}
                      className="btn bg-transparent hover:bg-orange-500/10 border border-orange-500/30 text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleAddNote}
                      className="btn bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 transition-all"
                      disabled={!newNote.trim()}
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutreachTracking; 