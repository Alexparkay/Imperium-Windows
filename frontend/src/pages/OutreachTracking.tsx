import { useState, useEffect, useMemo } from 'react';
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
  MdOutlinePersonAdd,
  MdOutlineLightbulb
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

// Define a class for glassmorphic panels using CSS classes
const glassPanelClass = "backdrop-blur-2xl bg-gradient-to-br from-[#1a1a1a]/80 via-[#1a1a1a]/50 to-[rgba(26,26,26,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-blue-500/10 p-6 mb-8 hover:border-blue-500/20 transition-all duration-300";

// For the metric cards we need additional styling
const metricCardClass = "backdrop-blur-2xl bg-gradient-to-br from-[#1a1a1a]/80 via-[#1a1a1a]/50 to-[rgba(26,26,26,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-blue-500/10 p-6 flex flex-col items-center transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10";

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
  const [timeRange, setTimeRange] = useState('30d'); // '7d', '30d', '90d', '1y'
  const [selectedMetric, setSelectedMetric] = useState('engagement'); // 'engagement', 'conversion', 'revenue'
  const [showAiInsight, setShowAiInsight] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showContactsList, setShowContactsList] = useState(false);

  // Sample data for charts
  const engagementData = [
    { date: '2024-01', email: 165, linkedin: 145, whatsapp: 155 },
    { date: '2024-02', email: 175, linkedin: 160, whatsapp: 180 },
    { date: '2024-03', email: 185, linkedin: 190, whatsapp: 210 },
    { date: '2024-04', email: 210, linkedin: 225, whatsapp: 245 },
    { date: '2024-05', email: 250, linkedin: 265, whatsapp: 295 },
    { date: '2024-06', email: 295, linkedin: 320, whatsapp: 360 },
  ];

  const conversionData = [
    { date: '2024-01', email: 28, linkedin: 22, whatsapp: 32 },
    { date: '2024-02', email: 35, linkedin: 30, whatsapp: 38 },
    { date: '2024-03', email: 42, linkedin: 39, whatsapp: 47 },
    { date: '2024-04', email: 51, linkedin: 49, whatsapp: 56 },
    { date: '2024-05', email: 63, linkedin: 58, whatsapp: 68 },
    { date: '2024-06', email: 78, linkedin: 72, whatsapp: 85 },
  ];

  const revenueData = [
    { date: '2024-01', email: 750000, linkedin: 680000, whatsapp: 820000 },
    { date: '2024-02', email: 890000, linkedin: 820000, whatsapp: 950000 },
    { date: '2024-03', email: 1050000, linkedin: 980000, whatsapp: 1200000 },
    { date: '2024-04', email: 1280000, linkedin: 1150000, whatsapp: 1420000 },
    { date: '2024-05', email: 1650000, linkedin: 1430000, whatsapp: 1750000 },
    { date: '2024-06', email: 2150000, linkedin: 1850000, whatsapp: 2300000 },
  ];

  const dealSizeData = [
    { name: 'Small (<$50k)', value: 35 },
    { name: 'Medium ($50k-$200k)', value: 45 },
    { name: 'Large ($200k-$500k)', value: 15 },
    { name: 'Enterprise (>$500k)', value: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
        return 'bg-blue-500/20 text-[#2a64f5] border border-blue-500/20';
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
        return 'text-blue-500';
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

  // Generate additional contact data for demo purposes
  const generateAdditionalContacts = () => {
    return expandedContacts.map(contact => ({
      ...contact
    }));
  };

  const displayContacts = generateAdditionalContacts();

  // Display channel-specific metrics based on active tab
  const getActiveChannelMetrics = () => {
    switch (activeTab) {
      case 'email':
        return { 
          metrics: {
            sent: 8456,
            opened: 3782,
            clicked: 1893,
            responded: 872,
            meetings: 143
          }
        };
      case 'linkedin':
        return {
          metrics: {
            connections: 1245,
            messages: 867,
            responses: 392,
            meetings: 87
          }
        };
      case 'whatsapp':
        return {
          metrics: {
            sent: 1893,
            delivered: 1876,
            read: 1654,
            replied: 845,
            meetings: 67
          }
        };
      default:
        return {
          metrics: {
            sent: 8456,
            opened: 3782,
            clicked: 1893,
            responded: 872,
            meetings: 143
          }
        };
    }
  };

  // Get the appropriate icon for each channel
  const getChannelIcon = (channel: ChannelType) => {
    switch (channel) {
      case 'email':
        return <MdOutlineEmail className="text-xl" />;
      case 'linkedin':
        return <FaLinkedin size={24} />;
      case 'whatsapp':
        return <FaWhatsapp size={24} />;
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

  // Channel-specific data with updated higher metrics
  const emailMetrics = {
    delivery: {
      sent: 28456,
      delivered: 27893,
      spamRate: 2.0,
      deliverability: 98.0,
    },
    engagement: {
      opens: 13782,
      openRate: 51.2,
      clicks: 7893,
      clickRate: 28.3,
      uniqueOpens: 11421,
      uniqueOpenRate: 47.5,
    },
    responses: {
      total: 3872,
      responseRate: 14.8,
      positive: 2156,
      positiveRate: 8.4,
      negative: 516,
      negativeRate: 1.9,
      neutral: 1200,
      neutralRate: 4.5,
    },
    aiOptimization: {
      autoReplyRate: 591,
      avgResponseTime: 18, // seconds
      optimizedTemplates: 37,
      personalizationScore: 94,
    },
    timing: {
      bestDay: 'Tuesday',
      bestHour: '10:00',
      worstDay: 'Sunday',
      worstHour: '18:00',
    }
  };

  const linkedinMetrics = {
    connections: {
      total: 12450,
      new: 1156,
      pending: 289,
      accepted: 11123,
      acceptRate: 61.5,
    },
    engagement: {
      profileViews: 22345,
      postEngagement: 8760,
      messageOpens: 8670,
      messageOpenRate: 82.2,
      contentInteractions: 12340,
    },
    responses: {
      total: 3920,
      responseRate: 44.4,
      positive: 2450,
      positiveRate: 27.6,
      negative: 870,
      negativeRate: 9.0,
      neutral: 600,
      neutralRate: 7.8,
    },
    aiOptimization: {
      connectionQuality: 97,
      messageOptimization: 93,
      contentRecommendations: 45,
      engagementPredictions: 96,
    },
    content: {
      postsCreated: 145,
      articlesShared: 83,
      commentsReceived: 3450,
      sharesGenerated: 1230,
    }
  };

  const whatsappMetrics = {
    delivery: {
      sent: 18930,
      delivered: 18760,
      deliveredRate: 99.1,
      failed: 170,
      failedRate: 0.9,
    },
    engagement: {
      read: 16540,
      readRate: 87.4,
      replied: 8450,
      replyRate: 44.6,
      forwarded: 2340,
      forwardedRate: 12.4,
    },
    responses: {
      total: 8450,
      responseRate: 54.6,
      positive: 5670,
      positiveRate: 37.0,
      negative: 1780,
      negativeRate: 11.4,
      neutral: 1000,
      neutralRate: 6.2,
    },
    aiOptimization: {
      responseTime: 12, // seconds
      autoReplyRate: 623,
      contextUnderstanding: 97,
      sentimentAnalysis: 95,
    },
    timing: {
      bestDay: 'Wednesday',
      bestHour: '14:00',
      worstDay: 'Saturday',
      worstHour: '22:00',
    }
  };

  // AI Insights for each channel with enhanced learning narrative
  const aiInsights = {
    email: [
      {
        type: 'optimization',
        title: 'Neural Response Optimization',
        description: '591% higher reply rate when responding within 18 seconds. Our AI neural network has self-optimized response timing patterns.',
        impact: 'high',
        metric: 'response_rate',
        change: '+591%',
        icon: <MdOutlineSpeed className="text-blue-500" />,
        learnings: 'AI has learned that immediate contextual responses generate significantly higher engagement than delayed responses.'
      },
      {
        type: 'pattern',
        title: 'Subject Line Neural Analysis',
        description: 'Emails with personalized industry-specific terms show 67% higher open rates. AI has autonomously identified key language patterns.',
        impact: 'high',
        metric: 'open_rate',
        change: '+67%',
        icon: <MdOutlineTrendingUp className="text-blue-500" />,
        learnings: 'AI has learned to distinguish between generic subject lines and those with specific terminology relevant to the recipient\'s industry.'
      },
      {
        type: 'timing',
        title: 'Temporal Pattern Recognition',
        description: 'AI identified sending emails on Tuesday at 10:42 AM results in 43% higher engagement through ongoing analysis.',
        impact: 'medium',
        metric: 'engagement',
        change: '+43%',
        icon: <MdOutlineAccessTime className="text-blue-500" />,
        learnings: 'The neural system has detected cyclical patterns in recipient availability and attention span.'
      }
    ],
    linkedin: [
      {
        type: 'optimization',
        title: 'Connection Neural Prioritization',
        description: 'AI has autonomously identified 1,156 high-value connections based on neural network decision trees analyzing 27 variables.',
        impact: 'high',
        metric: 'connection_quality',
        change: '+97%',
        icon: <MdOutlineGroups className="text-blue-500" />,
        learnings: 'The system learned to recognize potential decision makers through language patterns and behavioral indicators in profiles.'
      },
      {
        type: 'content',
        title: 'Content Evolution Engine',
        description: 'Posts about SAP migration case studies with specific ROI metrics generate 4.7x more engagement. AI continuously refines content approach.',
        impact: 'high',
        metric: 'engagement',
        change: '+470%',
        icon: <MdOutlineTrendingUp className="text-blue-500" />,
        learnings: 'AI has discovered that quantifiable success metrics in case studies create significantly more credibility and engagement.'
      },
      {
        type: 'timing',
        title: 'Connection Sequence Optimization',
        description: 'AI-optimized multi-touch sequences yield 85% higher response rates compared to standard outreach approaches.',
        impact: 'high',
        metric: 'response_rate',
        change: '+85%',
        icon: <MdOutlineAccessTime className="text-blue-500" />,
        learnings: 'Neural analysis revealed optimal timing between connection, engagement, and direct outreach for maximum effectiveness.'
      }
    ],
    whatsapp: [
      {
        type: 'optimization',
        title: 'Real-time Response Adaptation',
        description: '623% higher engagement with AI-driven contextual responses delivered within 12 seconds.',
        impact: 'high',
        metric: 'engagement',
        change: '+623%',
        icon: <MdOutlineSpeed className="text-blue-500" />,
        learnings: 'AI has continuously improved its response time and contextual understanding through reinforcement learning.'
      },
      {
        type: 'pattern',
        title: 'Message Personalization Evolution',
        description: 'Neural-crafted personalized messages show 128% higher response rates. AI autonomously refines personalization approach.',
        impact: 'high',
        metric: 'response_rate',
        change: '+128%',
        icon: <MdOutlineTrendingUp className="text-blue-500" />,
        learnings: 'The system has learned to extract and incorporate recipient-specific information in ways that feel authentic and relevant.'
      },
      {
        type: 'timing',
        title: 'Behavioral Timing Optimization',
        description: 'AI has detected recipient-specific optimal contact windows, increasing read rates by 92%.',
        impact: 'high',
        metric: 'read_rate',
        change: '+92%',
        icon: <MdOutlineAccessTime className="text-blue-500" />,
        learnings: 'Neural network has identified individual behavioral patterns and schedule variations across different prospect types.'
      }
    ]
  };

  // Example data for Email with upward trends
  const emailChartData = [
    { month: 'Jan', contacted: 130, opened: 65, replied: 32, positive: 16 },
    { month: 'Feb', contacted: 165, opened: 85, replied: 42, positive: 21 },
    { month: 'Mar', contacted: 210, opened: 110, replied: 56, positive: 28 },
    { month: 'Apr', contacted: 260, opened: 140, replied: 72, positive: 38 },
    { month: 'May', contacted: 320, opened: 180, replied: 95, positive: 52 },
    { month: 'Jun', contacted: 390, opened: 230, replied: 125, positive: 68 },
    { month: 'Jul', contacted: 470, opened: 290, replied: 155, positive: 85 },
    { month: 'Aug', contacted: 580, opened: 360, replied: 190, positive: 105 },
    { month: 'Sep', contacted: 700, opened: 440, replied: 235, positive: 130 },
    { month: 'Oct', contacted: 850, opened: 530, replied: 290, positive: 160 },
    { month: 'Nov', contacted: 1020, opened: 650, replied: 350, positive: 195 },
    { month: 'Dec', contacted: 1250, opened: 790, replied: 430, positive: 240 },
  ];

  // Example spike explanations with AI learning narrative
  const emailSpikes = {
    4: 'AI detected an opportunity to optimize subject lines for manufacturing industry - implemented autonomously',
    7: 'Neural system learned to identify decision-makers more effectively, increasing targeting precision by 78%',
    9: 'Self-improving AI auto-replied to leads within 12 seconds, boosting replies by 591%',
    11: 'AI autonomously refined personalization approach based on 12,450 previous interactions'
  };

  // For LinkedIn/WhatsApp charts with upward trends
  const linkedinChartData = [
    { month: 'Jan', connections: 150, messages: 80, replies: 30, positive: 15 },
    { month: 'Feb', connections: 190, messages: 110, replies: 45, positive: 22 },
    { month: 'Mar', connections: 240, messages: 140, replies: 65, positive: 32 },
    { month: 'Apr', connections: 310, messages: 185, replies: 90, positive: 45 },
    { month: 'May', connections: 390, messages: 240, replies: 120, positive: 62 },
    { month: 'Jun', connections: 490, messages: 310, replies: 160, positive: 85 },
    { month: 'Jul', connections: 620, messages: 390, replies: 210, positive: 115 },
    { month: 'Aug', connections: 780, messages: 495, replies: 270, positive: 145 },
    { month: 'Sep', connections: 980, messages: 620, replies: 340, positive: 185 },
    { month: 'Oct', connections: 1220, messages: 780, replies: 430, positive: 235 },
    { month: 'Nov', connections: 1530, messages: 980, replies: 530, positive: 290 },
    { month: 'Dec', connections: 1920, messages: 1240, replies: 680, positive: 370 },
  ];

  const whatsappChartData = [
    { month: 'Jan', sent: 200, delivered: 198, read: 150, replied: 75 },
    { month: 'Feb', sent: 260, delivered: 256, read: 210, replied: 105 },
    { month: 'Mar', sent: 340, delivered: 336, read: 285, replied: 145 },
    { month: 'Apr', sent: 440, delivered: 435, read: 370, replied: 195 },
    { month: 'May', sent: 580, delivered: 574, read: 490, replied: 260 },
    { month: 'Jun', sent: 760, delivered: 752, read: 650, replied: 350 },
    { month: 'Jul', sent: 980, delivered: 970, read: 840, replied: 460 },
    { month: 'Aug', sent: 1280, delivered: 1270, read: 1100, replied: 600 },
    { month: 'Sep', sent: 1650, delivered: 1635, read: 1420, replied: 780 },
    { month: 'Oct', sent: 2150, delivered: 2130, read: 1860, replied: 1020 },
    { month: 'Nov', sent: 2780, delivered: 2750, read: 2420, replied: 1340 },
    { month: 'Dec', sent: 3600, delivered: 3560, read: 3150, replied: 1740 },
  ];

  // Spike explanations with AI learning narrative
  const linkedinSpikes = {
    5: 'AI neural network identified optimal connection pattern sequence, boosting acceptance rate by 76%',
    7: 'AI autonomously evolved content strategy, increasing engagement by 412%',
    9: 'Neural system developed industry-specific messaging, improving response quality by 218%',
    11: 'AI discovered and implemented new decision-maker identification patterns'
  };

  const whatsappSpikes = {
    4: 'AI learned optimal emoji placement in messages, increasing read rates by 56%',
    6: 'Neural response time optimization reduced average response time to 12 seconds',
    8: 'AI autonomously refined message structure based on 24,790 previous interactions',
    10: 'AI detected and implemented industry-specific terminology patterns, boosting reply rate by 623%'
  };

  // Example contacts data for the list
  const contactsData = [
    { id: 1, name: "Jeff Levy", email: "j.levy@example.com", company: "SAP Finance", position: "SAP Manager", status: "positive", date: "2023-12-17", notes: "Interested in scheduling a demo" },
    { id: 2, name: "Amy Huke", email: "a.huke@example.com", company: "Honeywell", position: "ERP Director", status: "replied", date: "2023-12-15", notes: "Asked for more information" },
    { id: 3, name: "Ryan Kuddes", email: "r.kuddes@example.com", company: "Siemens", position: "IT Manager", status: "not_replied", date: "2023-12-22", notes: "" },
    { id: 4, name: "Sarah Johnson", email: "s.johnson@example.com", company: "Microsoft", position: "CTO", status: "positive", date: "2023-12-12", notes: "Very interested in our solution" },
    { id: 5, name: "Michael Chang", email: "m.chang@example.com", company: "Oracle", position: "SAP Consultant", status: "negative", date: "2023-12-10", notes: "Not interested at this time" },
    { id: 6, name: "Lisa Fernandez", email: "l.fernandez@example.com", company: "IBM", position: "IT Director", status: "replied", date: "2023-12-08", notes: "Requested pricing information" },
    { id: 7, name: "David Kim", email: "d.kim@example.com", company: "Samsung", position: "ERP Manager", status: "not_replied", date: "2023-12-05", notes: "" },
    { id: 8, name: "Emily Wilson", email: "e.wilson@example.com", company: "Deloitte", position: "SAP Specialist", status: "not_replied", date: "2023-12-03", notes: "" },
  ];

  // Filter contacts based on selected filter
  const filteredContacts = useMemo(() => {
    switch(selectedFilter) {
      case 'replied':
        return contactsData.filter(c => c.status === 'replied');
      case 'not_replied':
        return contactsData.filter(c => c.status === 'not_replied');
      case 'positive':
        return contactsData.filter(c => c.status === 'positive');
      case 'negative':
        return contactsData.filter(c => c.status === 'negative');
      default:
        return contactsData;
    }
  }, [selectedFilter]);

  // Get status badge styling
  const getStatusBadge = (status: string): string => {
    switch(status) {
      case 'positive':
        return 'bg-[#2a64f5]/20 text-[#2a64f5] border border-[#2a64f5]/20';
      case 'negative':
        return 'bg-red-500/20 text-red-400 border border-red-500/20';
      case 'replied':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/20';
      case 'not_replied':
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/20';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/20';
    }
  };

  // Get status label
  const getStatusLabel = (status: string): string => {
    switch(status) {
      case 'positive':
        return 'Positive';
      case 'negative':
        return 'Negative';
      case 'replied':
        return 'Replied';
      case 'not_replied':
        return 'No Reply';
      default:
        return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020305] flex items-center justify-center relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="fixed top-20 right-40 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl transform rotate-12 opacity-70 pointer-events-none"></div>
        <div className="fixed bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-60 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="relative">
                            <div className="absolute inset-0 bg-[#2a64f5] rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="loading loading-spinner loading-lg text-blue-500 relative"></div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">AI Analytics System</h2>
            <p className="text-white/60">Neural network processing outreach patterns...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-1 py-8 bg-[#020305] min-h-screen min-w-full relative">
      {/* Background gradient orbs */}
      <div className="fixed top-20 right-40 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl transform rotate-12 opacity-70 pointer-events-none"></div>
      <div className="fixed bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-60 pointer-events-none"></div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Header with Time Range Selector */}
          <div className="pt-4 pb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#2a64f5]">
                {getChannelName(activeTab)} Neural Analytics
              </h1>
              <p className="text-white/60 mt-2">
                {activeTab === 'email' && 'Self-optimizing AI system monitoring email performance and autonomously implementing improvements'}
                {activeTab === 'linkedin' && 'Neural network analyzing and enhancing LinkedIn connection and engagement patterns'}
                {activeTab === 'whatsapp' && 'Adaptive AI continuously evolving WhatsApp messaging effectiveness'}
              </p>
            </div>
            <div className="flex gap-4">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="select select-bordered bg-[#1e222b]/50 border-blue-500/20 text-white focus:border-blue-500/50"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>

          {/* AI System Status Banner */}
          <div className="backdrop-blur-2xl bg-gradient-to-br from-[#1a1a1a]/80 via-[#1a1a1a]/50 to-[rgba(26,26,26,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-blue-500/20 p-6 mb-6">
            <div className="flex items-center gap-4">
                              <div className="bg-[#2a64f5] p-4 rounded-xl text-white shadow-lg flex items-center justify-center">
                <MdOutlineDataUsage size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-white">Neural System Active</h3>
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2a64f5] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                  </span>
                </div>
                <p className="text-white/80 mt-1">AI brain has processed 127,893 interactions and implemented 437 autonomous optimizations</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-blue-500">
                    <MdOutlineTrendingUp />
                    <span>Learning rate: 97.3%</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/60">
                    <MdOutlineQueryStats />
                    <span>Pattern confidence: 94.8%</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/60">
                    <FaRegLightbulb />
                    <span>Insights generated: 142</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Channel Tabs */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Email Tab */}
            <button
              onClick={() => setActiveTab('email')}
              className={`backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-blue-500/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 ${
                activeTab === 'email' ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#2a64f5] p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
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

          {/* AI Insights Banner */}
          {showAiInsight && (
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#1a1a1a]/80 via-[#1a1a1a]/50 to-[rgba(26,26,26,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-blue-500/20 p-6 mb-6 hover:border-blue-500/30 transition-all duration-300">
              <div className="flex items-start gap-4">
                                  <div className="p-3 bg-[#2a64f5]/20 rounded-xl border border-[#2a64f5]/30">
                  {aiInsights[activeTab][0].icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-white mb-2">{aiInsights[activeTab][0].title}</h3>
                    <span className="px-2 py-0.5 bg-[#2a64f5]/20 text-[#2a64f5] text-xs rounded-full border border-[#2a64f5]/30">
                      AI Discovery
                    </span>
                  </div>
                  <p className="text-white/80">{aiInsights[activeTab][0].description}</p>
                  <div className="mt-2 text-white/70 text-sm">
                    <span className="font-medium text-[#2a64f5]">Neural learning: </span>
                    {aiInsights[activeTab][0].learnings}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-blue-500 font-medium">{aiInsights[activeTab][0].change}</span>
                    <span className="text-white/60">improvement in {aiInsights[activeTab][0].metric}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAiInsight(null)}
                  className="text-white/60 hover:text-white"
                >
                  <MdClose size={24} />
                </button>
              </div>
            </div>
          )}

          {/* Channel-specific Analytics */}
          {activeTab === 'email' && (
            <>
              {/* Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className={metricCardClass}>
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-3 rounded-full mb-2 border border-blue-500/30"><MdOutlinePerson className="text-blue-400 text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">1,770</div>
                  <div className="text-white/60 mt-1">Contacted</div>
                  <div className="text-blue-500 text-sm mt-1 flex items-center gap-1">
                    <MdOutlineTrendingUp />
                    <span>+28.5%</span>
                  </div>
                </div>
                <div className={metricCardClass}>
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 p-3 rounded-full mb-2 border border-purple-500/30"><MdOutlineMailOutline className="text-purple-400 text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">978</div>
                  <div className="text-white/60 mt-1">Opened</div>
                  <div className="text-blue-500 text-sm mt-1 flex items-center gap-1">
                    <MdOutlineTrendingUp />
                    <span>+52.3%</span>
                  </div>
                </div>
                <div className={metricCardClass}>
                  <div className="bg-[#2a64f5]/20 p-3 rounded-full mb-2 border border-blue-500/30"><MdOutlineReply className="text-[#2a64f5] text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">487</div>
                  <div className="text-white/60 mt-1">Replied</div>
                  <div className="text-blue-500 text-sm mt-1 flex items-center gap-1">
                    <MdOutlineTrendingUp />
                    <span>+89.6%</span>
                  </div>
                </div>
                <div className={metricCardClass}>
                  <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 p-3 rounded-full mb-2 border border-red-500/30"><MdOutlineTrendingUp className="text-red-400 text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">243</div>
                  <div className="text-white/60 mt-1">Positive</div>
                  <div className="text-blue-500 text-sm mt-1 flex items-center gap-1">
                    <MdOutlineTrendingUp />
                    <span>+126.7%</span>
                  </div>
                </div>
              </div>
              {/* Stacked Area Chart */}
              <div className={glassPanelClass}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">Analytics</h3>
                  <select className="select select-bordered bg-[#1e222b]/50 border-white/10 text-white w-40">
                    <option>Last Year</option>
                  </select>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={emailChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorContacted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorReplied" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" fontSize={14} />
                    <YAxis stroke="rgba(255,255,255,0.7)" fontSize={14} />
                    <Tooltip content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        // Find the index of the current month in the data array
                        const idx = emailChartData.findIndex(d => d.month === label);
                        const spikeMsg = emailSpikes[idx as keyof typeof emailSpikes];
                        return (
                          <div className={glassPanelClass}>
                            <div className="font-semibold text-white mb-1">{label}</div>
                            {payload.map((entry: any, i: number) => (
                              <div key={i} className="flex items-center gap-2 text-white/80">
                                <span style={{ color: entry.color, fontWeight: 600 }}>{entry.name}:</span>
                                <span>{entry.value}</span>
                              </div>
                            ))}
                            {spikeMsg && (
                              <div className="mt-2 text-blue-400 text-sm font-medium flex items-center gap-2">
                                <MdOutlineLightbulb className="text-yellow-400" />
                                {spikeMsg}
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Legend iconType="circle" wrapperStyle={{ color: 'white' }} />
                    <Area type="monotone" dataKey="contacted" stackId="1" stroke="#2563eb" fill="url(#colorContacted)" name="Contacted" />
                    <Area type="monotone" dataKey="opened" stackId="1" stroke="#8b5cf6" fill="url(#colorOpened)" name="Opened" />
                    <Area type="monotone" dataKey="replied" stackId="1" stroke="#10b981" fill="url(#colorReplied)" name="Replied" />
                    <Area type="monotone" dataKey="positive" stackId="1" stroke="#f43f5e" fill="url(#colorPositive)" name="Positive" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Contacts List with Filtering */}
              <div className={glassPanelClass}>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-white">Outreach Contacts</h3>
                    <div className="badge badge-primary">{filteredContacts.length}</div>
                  </div>
                  <button 
                    onClick={() => setShowContactsList(!showContactsList)}
                    className="flex items-center gap-2 text-white/80 hover:text-white"
                  >
                    {showContactsList ? <MdExpandLess size={24} /> : <MdExpandMore size={24} />}
                    {showContactsList ? 'Hide Contacts' : 'Show Contacts'}
                  </button>
                </div>

                {/* Filter buttons */}
                <div className="flex gap-2 flex-wrap mb-4">
                  <button 
                    onClick={() => setSelectedFilter('all')}
                    className={`py-2 px-4 rounded-full text-sm ${selectedFilter === 'all' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : 'bg-[#1e222b]/50 text-white/60 border border-white/10'}`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setSelectedFilter('replied')}
                    className={`py-2 px-4 rounded-full text-sm ${selectedFilter === 'replied' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : 'bg-[#1e222b]/50 text-white/60 border border-white/10'}`}
                  >
                    Replied
                  </button>
                  <button 
                    onClick={() => setSelectedFilter('not_replied')}
                    className={`py-2 px-4 rounded-full text-sm ${selectedFilter === 'not_replied' ? 'bg-gray-500/20 text-gray-400 border border-gray-500/50' : 'bg-[#1e222b]/50 text-white/60 border border-white/10'}`}
                  >
                    Not Replied
                  </button>
                  <button 
                    onClick={() => setSelectedFilter('positive')}
                    className={`py-2 px-4 rounded-full text-sm ${selectedFilter === 'positive' ? 'bg-blue-500/20 text-[#2a64f5] border border-blue-500/50' : 'bg-[#1e222b]/50 text-white/60 border border-white/10'}`}
                  >
                    Positive
                  </button>
                  <button 
                    onClick={() => setSelectedFilter('negative')}
                    className={`py-2 px-4 rounded-full text-sm ${selectedFilter === 'negative' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-[#1e222b]/50 text-white/60 border border-white/10'}`}
                  >
                    Negative
                  </button>
                </div>

                {/* Contacts table */}
                {showContactsList && (
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr className="text-white/60 border-b border-white/10">
                          <th className="bg-transparent">Name</th>
                          <th className="bg-transparent">Company</th>
                          <th className="bg-transparent">Position</th>
                          <th className="bg-transparent">Date</th>
                          <th className="bg-transparent">Status</th>
                          <th className="bg-transparent">Notes</th>
                          <th className="bg-transparent"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredContacts.map((contact) => (
                          <tr key={contact.id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="bg-transparent">
                              <div className="font-medium text-white">{contact.name}</div>
                              <div className="text-white/60 text-xs">{contact.email}</div>
                            </td>
                            <td className="bg-transparent">{contact.company}</td>
                            <td className="bg-transparent">{contact.position}</td>
                            <td className="bg-transparent">{contact.date}</td>
                            <td className="bg-transparent">
                              <span className={`py-1 px-2 rounded-md text-xs ${getStatusBadge(contact.status)}`}>
                                {getStatusLabel(contact.status)}
                              </span>
                            </td>
                            <td className="bg-transparent max-w-[150px] truncate">{contact.notes || '-'}</td>
                            <td className="bg-transparent">
                              <div className="flex gap-2">
                                <button className="p-1 text-white/60 hover:text-white">
                                  <FaRegEdit />
                                </button>
                                <button className="p-1 text-white/60 hover:text-white">
                                  <MdOutlineMoreVert />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Original Detailed Metrics - Now Below the Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Email Delivery Metrics */}
                <div className={glassPanelClass}>
                  <h3 className="text-xl font-semibold text-white mb-4">Delivery Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Sent</div>
                      <div className="text-2xl font-bold text-white">{emailMetrics.delivery.sent.toLocaleString()}</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Delivered</div>
                      <div className="text-2xl font-bold text-white">{emailMetrics.delivery.delivered.toLocaleString()}</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Spam Rate</div>
                      <div className="text-2xl font-bold text-white">{emailMetrics.delivery.spamRate}%</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Deliverability</div>
                      <div className="text-2xl font-bold text-white">{emailMetrics.delivery.deliverability}%</div>
                    </div>
                  </div>
                </div>

                {/* Email Engagement Metrics */}
                <div className={glassPanelClass}>
                  <h3 className="text-xl font-semibold text-white mb-4">Engagement Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Open Rate</div>
                      <div className="text-2xl font-bold text-white">{emailMetrics.engagement.openRate}%</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Click Rate</div>
                      <div className="text-2xl font-bold text-white">{emailMetrics.engagement.clickRate}%</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Unique Opens</div>
                      <div className="text-2xl font-bold text-white">{emailMetrics.engagement.uniqueOpens.toLocaleString()}</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Unique Open Rate</div>
                      <div className="text-2xl font-bold text-white">{emailMetrics.engagement.uniqueOpenRate}%</div>
                    </div>
                  </div>
                </div>

                {/* AI Response Optimization */}
                <div className={glassPanelClass}>
                  <h3 className="text-xl font-semibold text-white mb-4">AI Response Optimization</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Auto Reply Rate</div>
                      <div className="text-2xl font-bold text-blue-500">+{emailMetrics.aiOptimization.autoReplyRate}%</div>
                      <div className="text-white/60 text-sm mt-1">vs manual responses</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Avg Response Time</div>
                      <div className="text-2xl font-bold text-white">{emailMetrics.aiOptimization.avgResponseTime}s</div>
                      <div className="text-white/60 text-sm mt-1">to first response</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Optimized Templates</div>
                      <div className="text-2xl font-bold text-white">{emailMetrics.aiOptimization.optimizedTemplates}</div>
                      <div className="text-white/60 text-sm mt-1">AI-enhanced</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Personalization Score</div>
                      <div className="text-2xl font-bold text-white">{emailMetrics.aiOptimization.personalizationScore}%</div>
                      <div className="text-white/60 text-sm mt-1">AI-optimized</div>
                    </div>
                  </div>
                </div>

                {/* Response Analysis */}
                <div className={glassPanelClass}>
                  <h3 className="text-xl font-semibold text-white mb-4">Response Analysis</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Total Responses</div>
                      <div className="text-2xl font-bold text-white">{emailMetrics.responses.total.toLocaleString()}</div>
                      <div className="text-white/60 text-sm mt-1">{emailMetrics.responses.responseRate}% response rate</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Positive Responses</div>
                      <div className="text-2xl font-bold text-blue-500">{emailMetrics.responses.positive.toLocaleString()}</div>
                      <div className="text-white/60 text-sm mt-1">{emailMetrics.responses.positiveRate}% positive rate</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Negative Responses</div>
                      <div className="text-2xl font-bold text-red-500">{emailMetrics.responses.negative.toLocaleString()}</div>
                      <div className="text-white/60 text-sm mt-1">{emailMetrics.responses.negativeRate}% negative rate</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Neutral Responses</div>
                      <div className="text-2xl font-bold text-yellow-500">{emailMetrics.responses.neutral.toLocaleString()}</div>
                      <div className="text-white/60 text-sm mt-1">{emailMetrics.responses.neutralRate}% neutral rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'linkedin' && (
            <>
              {/* Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className={metricCardClass}>
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-3 rounded-full mb-2 border border-blue-500/30"><MdOutlineGroups className="text-blue-400 text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">1,770</div>
                  <div className="text-white/60 mt-1">Contacted</div>
                  <div className="text-blue-500 text-sm mt-1 flex items-center gap-1">
                    <MdOutlineTrendingUp />
                    <span>+28.5%</span>
                  </div>
                </div>
                <div className={metricCardClass}>
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 p-3 rounded-full mb-2 border border-purple-500/30"><MdOutlineChat className="text-[#0A66C2] text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">867</div>
                  <div className="text-white/60 mt-1">Messages</div>
                  <div className="text-blue-500 text-sm mt-1 flex items-center gap-1">
                    <MdOutlineTrendingUp />
                    <span>+52.3%</span>
                  </div>
                </div>
                <div className={metricCardClass}>
                  <div className="bg-[#2a64f5]/20 p-3 rounded-full mb-2 border border-blue-500/30"><MdOutlineReply className="text-[#2a64f5] text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">392</div>
                  <div className="text-white/60 mt-1">Replies</div>
                  <div className="text-blue-500 text-sm mt-1 flex items-center gap-1">
                    <MdOutlineTrendingUp />
                    <span>+89.6%</span>
                  </div>
                </div>
                <div className={metricCardClass}>
                  <div className="bg-[#0A66C2]/20 p-3 rounded-full mb-2"><MdOutlineTrendingUp className="text-[#0A66C2] text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">87</div>
                  <div className="text-white/60 mt-1">Meetings</div>
                  <div className="text-blue-500 text-sm mt-1 flex items-center gap-1">
                    <MdOutlineTrendingUp />
                    <span>+126.7%</span>
                  </div>
                </div>
              </div>

              {/* Stacked Area Chart */}
              <div className={glassPanelClass}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">LinkedIn Performance</h3>
                  <select className="select select-bordered bg-[#1e222b]/50 border-white/10 text-white w-40">
                    <option>Last Year</option>
                  </select>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={linkedinChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorConnections" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0A66C2" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0A66C2" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorRepliesLI" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorPositiveLI" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" fontSize={14} />
                    <YAxis stroke="rgba(255,255,255,0.7)" fontSize={14} />
                    <Tooltip content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        // Find the index of the current month in the data array
                        const idx = linkedinChartData.findIndex(d => d.month === label);
                        const spikeMsg = linkedinSpikes[idx as keyof typeof linkedinSpikes];
                        return (
                          <div className={glassPanelClass}>
                            <div className="font-semibold text-white mb-1">{label}</div>
                            {payload.map((entry: any, i: number) => (
                              <div key={i} className="flex items-center gap-2 text-white/80">
                                <span style={{ color: entry.color, fontWeight: 600 }}>{entry.name}:</span>
                                <span>{entry.value}</span>
                              </div>
                            ))}
                            {spikeMsg && (
                              <div className="mt-2 text-blue-400 text-sm font-medium flex items-center gap-2">
                                <MdOutlineLightbulb className="text-yellow-400" />
                                {spikeMsg}
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Legend iconType="circle" wrapperStyle={{ color: 'white' }} />
                    <Area type="monotone" dataKey="connections" stackId="1" stroke="#0A66C2" fill="url(#colorConnections)" name="Connections" />
                    <Area type="monotone" dataKey="messages" stackId="1" stroke="#4F46E5" fill="url(#colorMessages)" name="Messages" />
                    <Area type="monotone" dataKey="replies" stackId="1" stroke="#10b981" fill="url(#colorRepliesLI)" name="Replies" />
                    <Area type="monotone" dataKey="positive" stackId="1" stroke="#f43f5e" fill="url(#colorPositiveLI)" name="Positive" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Original LinkedIn Metrics - Keep as they are */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LinkedIn Connection Metrics */}
                <div className={glassPanelClass}>
                  <h3 className="text-xl font-semibold text-white mb-4">Connection Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Total Connections</div>
                      <div className="text-2xl font-bold text-white">{linkedinMetrics.connections.total.toLocaleString()}</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">New Connections</div>
                      <div className="text-2xl font-bold text-white">{linkedinMetrics.connections.new.toLocaleString()}</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Accept Rate</div>
                      <div className="text-2xl font-bold text-white">{linkedinMetrics.connections.acceptRate}%</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Pending</div>
                      <div className="text-2xl font-bold text-white">{linkedinMetrics.connections.pending.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* LinkedIn Engagement Metrics */}
                <div className={glassPanelClass}>
                  <h3 className="text-xl font-semibold text-white mb-4">Engagement Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Profile Views</div>
                      <div className="text-2xl font-bold text-white">{linkedinMetrics.engagement.profileViews.toLocaleString()}</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Post Engagement</div>
                      <div className="text-2xl font-bold text-white">{linkedinMetrics.engagement.postEngagement.toLocaleString()}</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Message Open Rate</div>
                      <div className="text-2xl font-bold text-white">{linkedinMetrics.engagement.messageOpenRate}%</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Content Interactions</div>
                      <div className="text-2xl font-bold text-white">{linkedinMetrics.engagement.contentInteractions.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* AI Optimization */}
                <div className={glassPanelClass}>
                  <h3 className="text-xl font-semibold text-white mb-4">AI Optimization</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Connection Quality</div>
                      <div className="text-2xl font-bold text-blue-500">{linkedinMetrics.aiOptimization.connectionQuality}%</div>
                      <div className="text-white/60 text-sm mt-1">AI-scored quality</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Message Optimization</div>
                      <div className="text-2xl font-bold text-white">{linkedinMetrics.aiOptimization.messageOptimization}%</div>
                      <div className="text-white/60 text-sm mt-1">AI-enhanced</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Content Recommendations</div>
                      <div className="text-2xl font-bold text-white">{linkedinMetrics.aiOptimization.contentRecommendations}</div>
                      <div className="text-white/60 text-sm mt-1">AI-generated</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Engagement Predictions</div>
                      <div className="text-2xl font-bold text-white">{linkedinMetrics.aiOptimization.engagementPredictions}%</div>
                      <div className="text-white/60 text-sm mt-1">Accuracy rate</div>
                    </div>
                  </div>
                </div>

                {/* Content Performance */}
                <div className={glassPanelClass}>
                  <h3 className="text-xl font-semibold text-white mb-4">Content Performance</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Posts Created</div>
                      <div className="text-2xl font-bold text-white">{linkedinMetrics.content.postsCreated}</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Articles Shared</div>
                      <div className="text-2xl font-bold text-white">{linkedinMetrics.content.articlesShared}</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Comments Received</div>
                      <div className="text-2xl font-bold text-white">{linkedinMetrics.content.commentsReceived.toLocaleString()}</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Shares Generated</div>
                      <div className="text-2xl font-bold text-white">{linkedinMetrics.content.sharesGenerated.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'whatsapp' && (
            <>
              {/* Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className={metricCardClass}>
                  <div className="bg-[#25D366]/20 p-3 rounded-full mb-2"><MdSend className="text-[#25D366] text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">1893</div>
                  <div className="text-white/60 mt-1">Sent</div>
                  <div className="text-blue-500 text-sm mt-1 flex items-center gap-1">
                    <MdOutlineTrendingUp />
                    <span>+52.3%</span>
                  </div>
                </div>
                <div className={metricCardClass}>
                  <div className="bg-[#25D366]/20 p-3 rounded-full mb-2"><MdOutlineOpenInNew className="text-[#25D366] text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">1654</div>
                  <div className="text-white/60 mt-1">Read</div>
                  <div className="text-blue-500 text-sm mt-1 flex items-center gap-1">
                    <MdOutlineTrendingUp />
                    <span>+65.4%</span>
                  </div>
                </div>
                <div className={metricCardClass}>
                  <div className="bg-[#25D366]/20 p-3 rounded-full mb-2"><MdOutlineReply className="text-[#25D366] text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">845</div>
                  <div className="text-white/60 mt-1">Replied</div>
                  <div className="text-blue-500 text-sm mt-1 flex items-center gap-1">
                    <MdOutlineTrendingUp />
                    <span>+78.9%</span>
                  </div>
                </div>
                <div className={metricCardClass}>
                  <div className="bg-[#25D366]/20 p-3 rounded-full mb-2"><MdOutlineTrendingUp className="text-[#25D366] text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">67</div>
                  <div className="text-white/60 mt-1">Meetings</div>
                  <div className="text-blue-500 text-sm mt-1 flex items-center gap-1">
                    <MdOutlineTrendingUp />
                    <span>+92.1%</span>
                  </div>
                </div>
              </div>

              {/* Stacked Area Chart */}
              <div className={glassPanelClass}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">WhatsApp Performance</h3>
                  <select className="select select-bordered bg-[#1e222b]/50 border-white/10 text-white w-40">
                    <option>Last Year</option>
                  </select>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={whatsappChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#25D366" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#25D366" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34B7F1" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#34B7F1" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorRead" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4ECB71" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4ECB71" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorRepliedWA" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" fontSize={14} />
                    <YAxis stroke="rgba(255,255,255,0.7)" fontSize={14} />
                    <Tooltip content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        // Find the index of the current month in the data array
                        const idx = whatsappChartData.findIndex(d => d.month === label);
                        const spikeMsg = whatsappSpikes[idx as keyof typeof whatsappSpikes];
                        return (
                          <div className={glassPanelClass}>
                            <div className="font-semibold text-white mb-1">{label}</div>
                            {payload.map((entry: any, i: number) => (
                              <div key={i} className="flex items-center gap-2 text-white/80">
                                <span style={{ color: entry.color, fontWeight: 600 }}>{entry.name}:</span>
                                <span>{entry.value}</span>
                              </div>
                            ))}
                            {spikeMsg && (
                              <div className="mt-2 text-blue-400 text-sm font-medium flex items-center gap-2">
                                <MdOutlineLightbulb className="text-yellow-400" />
                                {spikeMsg}
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Legend iconType="circle" wrapperStyle={{ color: 'white' }} />
                    <Area type="monotone" dataKey="sent" stackId="1" stroke="#25D366" fill="url(#colorSent)" name="Sent" />
                    <Area type="monotone" dataKey="delivered" stackId="1" stroke="#34B7F1" fill="url(#colorDelivered)" name="Delivered" />
                    <Area type="monotone" dataKey="read" stackId="1" stroke="#4ECB71" fill="url(#colorRead)" name="Read" />
                    <Area type="monotone" dataKey="replied" stackId="1" stroke="#10b981" fill="url(#colorRepliedWA)" name="Replied" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Original WhatsApp Metrics - Keep as they are */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* WhatsApp Delivery Metrics */}
                <div className={glassPanelClass}>
                  <h3 className="text-xl font-semibold text-white mb-4">Delivery Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Total Sent</div>
                      <div className="text-2xl font-bold text-white">{whatsappMetrics.delivery.sent.toLocaleString()}</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Delivered</div>
                      <div className="text-2xl font-bold text-white">{whatsappMetrics.delivery.delivered.toLocaleString()}</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Delivery Rate</div>
                      <div className="text-2xl font-bold text-white">{whatsappMetrics.delivery.deliveredRate}%</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Failed</div>
                      <div className="text-2xl font-bold text-red-500">{whatsappMetrics.delivery.failed}</div>
                      <div className="text-white/60 text-sm mt-1">{whatsappMetrics.delivery.failedRate}% failure rate</div>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Engagement Metrics */}
                <div className={glassPanelClass}>
                  <h3 className="text-xl font-semibold text-white mb-4">Engagement Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Read Rate</div>
                      <div className="text-2xl font-bold text-white">{whatsappMetrics.engagement.readRate}%</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Reply Rate</div>
                      <div className="text-2xl font-bold text-white">{whatsappMetrics.engagement.replyRate}%</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Forwarded</div>
                      <div className="text-2xl font-bold text-white">{whatsappMetrics.engagement.forwarded.toLocaleString()}</div>
                      <div className="text-white/60 text-sm mt-1">{whatsappMetrics.engagement.forwardedRate}% forward rate</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Total Replies</div>
                      <div className="text-2xl font-bold text-white">{whatsappMetrics.engagement.replied.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* AI Response Optimization */}
                <div className={glassPanelClass}>
                  <h3 className="text-xl font-semibold text-white mb-4">AI Response Optimization</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Response Time</div>
                      <div className="text-2xl font-bold text-blue-500">{whatsappMetrics.aiOptimization.responseTime}s</div>
                      <div className="text-white/60 text-sm mt-1">average response time</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Auto Reply Rate</div>
                      <div className="text-2xl font-bold text-white">+{whatsappMetrics.aiOptimization.autoReplyRate}%</div>
                      <div className="text-white/60 text-sm mt-1">vs manual responses</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Context Understanding</div>
                      <div className="text-2xl font-bold text-white">{whatsappMetrics.aiOptimization.contextUnderstanding}%</div>
                      <div className="text-white/60 text-sm mt-1">AI accuracy</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Sentiment Analysis</div>
                      <div className="text-2xl font-bold text-white">{whatsappMetrics.aiOptimization.sentimentAnalysis}%</div>
                      <div className="text-white/60 text-sm mt-1">AI accuracy</div>
                    </div>
                  </div>
                </div>

                {/* Response Analysis */}
                <div className={glassPanelClass}>
                  <h3 className="text-xl font-semibold text-white mb-4">Response Analysis</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Total Responses</div>
                      <div className="text-2xl font-bold text-white">{whatsappMetrics.responses.total.toLocaleString()}</div>
                      <div className="text-white/60 text-sm mt-1">{whatsappMetrics.responses.responseRate}% response rate</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Positive Responses</div>
                      <div className="text-2xl font-bold text-blue-500">{whatsappMetrics.responses.positive.toLocaleString()}</div>
                      <div className="text-white/60 text-sm mt-1">{whatsappMetrics.responses.positiveRate}% positive rate</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Negative Responses</div>
                      <div className="text-2xl font-bold text-red-500">{whatsappMetrics.responses.negative.toLocaleString()}</div>
                      <div className="text-white/60 text-sm mt-1">{whatsappMetrics.responses.negativeRate}% negative rate</div>
                    </div>
                    <div className="bg-[#1e222b]/50 rounded-xl p-4">
                      <div className="text-white/60 mb-1">Neutral Responses</div>
                      <div className="text-2xl font-bold text-yellow-500">{whatsappMetrics.responses.neutral.toLocaleString()}</div>
                      <div className="text-white/60 text-sm mt-1">{whatsappMetrics.responses.neutralRate}% neutral rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* AI Insights Section */}
          <div className={glassPanelClass}>
            <h3 className="text-xl font-semibold text-white mb-4">AI-Powered Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-[#1e222b]/50 rounded-xl p-4 border border-white/10">
                  <h4 className="text-lg font-medium text-white mb-2">Top Performing Campaigns</h4>
                  <ul className="space-y-2">
                    {aiInsights[activeTab].map((insight, index) => (
                      <li 
                        key={index}
                        className="flex items-center gap-2 text-white/80 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors"
                        onClick={() => setShowAiInsight(insight.title)}
                      >
                        {insight.icon}
                        <span>{insight.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights Section with enhanced design */}
          <div className={glassPanelClass}>
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-[#2a64f5] p-4 rounded-xl text-white shadow-lg">
                <MdOutlineLightbulb size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Neural Network Discoveries</h3>
                <p className="text-white/60">AI-identified patterns and autonomous optimizations</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {aiInsights[activeTab].map((insight, index) => (
                <div 
                  key={index}
                  className="backdrop-blur-2xl bg-gradient-to-br from-[#1a1a1a]/80 via-[#1a1a1a]/50 to-[rgba(26,26,26,0.2)] rounded-xl shadow-lg border border-blue-500/15 p-5 hover:border-blue-500/30 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  onClick={() => setShowAiInsight(insight.title)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-[#2a64f5]/20 p-2 rounded-lg border border-blue-500/30">
                      {insight.icon}
                    </div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-white">{insight.title}</h4>
                      <span className="px-1.5 py-0.5 bg-blue-500/20 text-[#2a64f5] text-xs rounded-full border border-blue-500/30">
                        +{insight.change}
                      </span>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm line-clamp-2">{insight.description}</p>
                  <div className="mt-3 text-blue-500 text-xs font-medium flex items-center gap-1">
                    <MdOutlineQueryStats />
                    <span>Pattern confidence: {Math.floor(85 + Math.random() * 13)}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Learning Evolution Graph */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-white mb-4">AI Learning Evolution</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={[
                  {day: 1, accuracy: 65},
                  {day: 2, accuracy: 68},
                  {day: 3, accuracy: 72},
                  {day: 4, accuracy: 74},
                  {day: 5, accuracy: 78},
                  {day: 6, accuracy: 81},
                  {day: 7, accuracy: 83},
                  {day: 8, accuracy: 84},
                  {day: 9, accuracy: 87},
                  {day: 10, accuracy: 89},
                  {day: 11, accuracy: 91},
                  {day: 12, accuracy: 93},
                  {day: 13, accuracy: 94},
                  {day: 14, accuracy: 95},
                  {day: 15, accuracy: 96},
                  {day: 16, accuracy: 97},
                  {day: 17, accuracy: 97.5},
                  {day: 18, accuracy: 98},
                  {day: 19, accuracy: 98.2},
                  {day: 20, accuracy: 98.5},
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.7)" fontSize={12} label={{value: 'Learning Days', position: 'insideBottom', offset: -10, fill: 'rgba(255,255,255,0.7)'}} />
                  <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} label={{value: 'Pattern Accuracy %', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.7)'}} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="backdrop-blur-2xl bg-[#1a1a1a]/90 p-3 border border-blue-500/20 rounded-lg text-white text-sm">
                            <p>Day {payload[0].payload.day}: {payload[0].value}% accuracy</p>
                            {payload[0].payload.day === 7 && 
                              <p className="text-[#2a64f5] text-xs mt-1">First pattern established</p>
                            }
                            {payload[0].payload.day === 14 && 
                              <p className="text-[#2a64f5] text-xs mt-1">Neural refinement complete</p>
                            }
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} activeDot={{ r: 5, fill: '#10b981', stroke: 'white' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Add Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={glassPanelClass}>
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-4 text-white">
                Add Note for {selectedContact?.name}
              </h3>
              <div className="form-control">
                <textarea 
                  className="textarea backdrop-blur-md bg-[#28292b]/60 border border-blue-500/20 text-white focus:border-blue-500 h-32"
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
                  className="btn bg-gradient-to-br from-blue-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 transition-all"
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
  );
};

export default OutreachTracking; 
