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
const glassPanelClass = "backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/10 p-6 mb-8";

// For the metric cards we need additional styling
const metricCardClass = "backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/10 p-6 flex flex-col items-center";

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
    { date: '2024-01', email: 65, linkedin: 45, whatsapp: 55 },
    { date: '2024-02', email: 75, linkedin: 50, whatsapp: 60 },
    { date: '2024-03', email: 85, linkedin: 60, whatsapp: 70 },
    { date: '2024-04', email: 70, linkedin: 55, whatsapp: 65 },
    { date: '2024-05', email: 90, linkedin: 65, whatsapp: 75 },
    { date: '2024-06', email: 95, linkedin: 70, whatsapp: 80 },
  ];

  const conversionData = [
    { date: '2024-01', email: 12, linkedin: 8, whatsapp: 15 },
    { date: '2024-02', email: 15, linkedin: 10, whatsapp: 18 },
    { date: '2024-03', email: 18, linkedin: 12, whatsapp: 20 },
    { date: '2024-04', email: 14, linkedin: 9, whatsapp: 16 },
    { date: '2024-05', email: 20, linkedin: 15, whatsapp: 22 },
    { date: '2024-06', email: 22, linkedin: 18, whatsapp: 25 },
  ];

  const revenueData = [
    { date: '2024-01', email: 250000, linkedin: 180000, whatsapp: 300000 },
    { date: '2024-02', email: 300000, linkedin: 220000, whatsapp: 350000 },
    { date: '2024-03', email: 350000, linkedin: 280000, whatsapp: 400000 },
    { date: '2024-04', email: 280000, linkedin: 200000, whatsapp: 320000 },
    { date: '2024-05', email: 400000, linkedin: 300000, whatsapp: 450000 },
    { date: '2024-06', email: 450000, linkedin: 350000, whatsapp: 500000 },
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

  // Channel-specific data
  const emailMetrics = {
    delivery: {
      sent: 8456,
      delivered: 8234,
      spamRate: 2.6,
      deliverability: 97.4,
    },
    engagement: {
      opens: 3782,
      openRate: 44.7,
      clicks: 1893,
      clickRate: 22.4,
      uniqueOpens: 3421,
      uniqueOpenRate: 40.5,
    },
    responses: {
      total: 872,
      responseRate: 10.3,
      positive: 456,
      positiveRate: 5.4,
      negative: 216,
      negativeRate: 2.6,
      neutral: 200,
      neutralRate: 2.3,
    },
    aiOptimization: {
      autoReplyRate: 391,
      avgResponseTime: 45, // seconds
      optimizedTemplates: 12,
      personalizationScore: 87,
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
      total: 1245,
      new: 156,
      pending: 89,
      accepted: 1123,
      acceptRate: 41.5,
    },
    engagement: {
      profileViews: 2345,
      postEngagement: 876,
      messageOpens: 867,
      messageOpenRate: 78.2,
      contentInteractions: 1234,
    },
    responses: {
      total: 392,
      responseRate: 31.4,
      positive: 245,
      positiveRate: 19.6,
      negative: 87,
      negativeRate: 7.0,
      neutral: 60,
      neutralRate: 4.8,
    },
    aiOptimization: {
      connectionQuality: 92,
      messageOptimization: 88,
      contentRecommendations: 15,
      engagementPredictions: 85,
    },
    content: {
      postsCreated: 45,
      articlesShared: 23,
      commentsReceived: 345,
      sharesGenerated: 123,
    }
  };

  const whatsappMetrics = {
    delivery: {
      sent: 1893,
      delivered: 1876,
      deliveredRate: 99.1,
      failed: 17,
      failedRate: 0.9,
    },
    engagement: {
      read: 1654,
      readRate: 87.4,
      replied: 845,
      replyRate: 44.6,
      forwarded: 234,
      forwardedRate: 12.4,
    },
    responses: {
      total: 845,
      responseRate: 44.6,
      positive: 567,
      positiveRate: 30.0,
      negative: 178,
      negativeRate: 9.4,
      neutral: 100,
      neutralRate: 5.2,
    },
    aiOptimization: {
      responseTime: 32, // seconds
      autoReplyRate: 423,
      contextUnderstanding: 91,
      sentimentAnalysis: 88,
    },
    timing: {
      bestDay: 'Wednesday',
      bestHour: '14:00',
      worstDay: 'Saturday',
      worstHour: '22:00',
    }
  };

  // AI Insights for each channel
  const aiInsights = {
    email: [
      {
        type: 'optimization',
        title: 'AI Response Optimization',
        description: '391% higher reply rate when responding within 60 seconds. Our AI agents are automatically optimizing response times.',
        impact: 'high',
        metric: 'response_rate',
        change: '+391%',
        icon: <MdOutlineSpeed className="text-green-500" />
      },
      {
        type: 'pattern',
        title: 'Subject Line Analysis',
        description: 'Emails with "SAP S/4HANA" in the subject line show 45% higher open rates.',
        impact: 'medium',
        metric: 'open_rate',
        change: '+45%',
        icon: <MdOutlineTrendingUp className="text-green-500" />
      },
      {
        type: 'timing',
        title: 'Optimal Send Time',
        description: 'Sending emails on Tuesday at 10:00 AM results in 28% higher engagement.',
        impact: 'medium',
        metric: 'engagement',
        change: '+28%',
        icon: <MdOutlineAccessTime className="text-green-500" />
      }
    ],
    linkedin: [
      {
        type: 'optimization',
        title: 'Connection Quality',
        description: 'AI has identified 156 high-value connections based on company size and role.',
        impact: 'high',
        metric: 'connection_quality',
        change: '+92%',
        icon: <MdOutlineGroups className="text-green-500" />
      },
      {
        type: 'content',
        title: 'Content Performance',
        description: 'Posts about SAP migration case studies generate 3.2x more engagement.',
        impact: 'high',
        metric: 'engagement',
        change: '+320%',
        icon: <MdOutlineTrendingUp className="text-green-500" />
      },
      {
        type: 'timing',
        title: 'Message Timing',
        description: 'Messages sent between 9-11 AM have 45% higher response rates.',
        impact: 'medium',
        metric: 'response_rate',
        change: '+45%',
        icon: <MdOutlineAccessTime className="text-green-500" />
      }
    ],
    whatsapp: [
      {
        type: 'optimization',
        title: 'Response Time Impact',
        description: '423% higher engagement when responding within 30 seconds.',
        impact: 'high',
        metric: 'engagement',
        change: '+423%',
        icon: <MdOutlineSpeed className="text-green-500" />
      },
      {
        type: 'pattern',
        title: 'Message Pattern',
        description: 'Personalized video messages show 78% higher response rates.',
        impact: 'high',
        metric: 'response_rate',
        change: '+78%',
        icon: <MdOutlineTrendingUp className="text-green-500" />
      },
      {
        type: 'timing',
        title: 'Optimal Contact Time',
        description: 'Messages sent on Wednesday at 2 PM have 65% higher read rates.',
        impact: 'medium',
        metric: 'read_rate',
        change: '+65%',
        icon: <MdOutlineAccessTime className="text-green-500" />
      }
    ]
  };

  // Example data for Email (expand for LinkedIn/WhatsApp as needed)
  const emailChartData = [
    { month: 'Jan', contacted: 10, opened: 4, replied: 1, positive: 0 },
    { month: 'Feb', contacted: 20, opened: 8, replied: 2, positive: 1 },
    { month: 'Mar', contacted: 30, opened: 12, replied: 4, positive: 2 },
    { month: 'Apr', contacted: 40, opened: 16, replied: 8, positive: 3 },
    { month: 'May', contacted: 60, opened: 24, replied: 12, positive: 5 },
    { month: 'Jun', contacted: 80, opened: 32, replied: 16, positive: 8 },
    { month: 'Jul', contacted: 70, opened: 28, replied: 14, positive: 7 },
    { month: 'Aug', contacted: 60, opened: 24, replied: 12, positive: 6 },
    { month: 'Sep', contacted: 90, opened: 36, replied: 18, positive: 9 },
    { month: 'Oct', contacted: 100, opened: 40, replied: 20, positive: 10 },
    { month: 'Nov', contacted: 80, opened: 32, replied: 16, positive: 8 },
    { month: 'Dec', contacted: 70, opened: 28, replied: 14, positive: 7 },
  ];

  // Example spike explanations
  const emailSpikes = {
    4: 'Spike due to Q2 SAP Migration campaign launch',
    9: 'AI auto-replied to 80% of leads within 1 minute, boosting replies by 391%'
  };

  // For LinkedIn/WhatsApp charts
  const linkedinChartData = [
    { month: 'Jan', connections: 15, messages: 8, replies: 3, positive: 1 },
    { month: 'Feb', connections: 25, messages: 15, replies: 6, positive: 2 },
    { month: 'Mar', connections: 35, messages: 20, replies: 10, positive: 4 },
    { month: 'Apr', connections: 40, messages: 25, replies: 12, positive: 5 },
    { month: 'May', connections: 55, messages: 35, replies: 18, positive: 7 },
    { month: 'Jun', connections: 70, messages: 45, replies: 22, positive: 9 },
    { month: 'Jul', connections: 60, messages: 40, replies: 20, positive: 8 },
    { month: 'Aug', connections: 50, messages: 30, replies: 15, positive: 6 },
    { month: 'Sep', connections: 65, messages: 42, replies: 21, positive: 8 },
    { month: 'Oct', connections: 85, messages: 55, replies: 28, positive: 11 },
    { month: 'Nov', connections: 70, messages: 45, replies: 22, positive: 9 },
    { month: 'Dec', connections: 60, messages: 38, replies: 19, positive: 7 },
  ];

  const whatsappChartData = [
    { month: 'Jan', sent: 20, delivered: 20, read: 15, replied: 5 },
    { month: 'Feb', sent: 40, delivered: 39, read: 30, replied: 12 },
    { month: 'Mar', sent: 60, delivered: 58, read: 45, replied: 22 },
    { month: 'Apr', sent: 80, delivered: 78, read: 65, replied: 35 },
    { month: 'May', sent: 120, delivered: 117, read: 100, replied: 52 },
    { month: 'Jun', sent: 160, delivered: 155, read: 135, replied: 70 },
    { month: 'Jul', sent: 140, delivered: 138, read: 120, replied: 62 },
    { month: 'Aug', sent: 120, delivered: 118, read: 100, replied: 48 },
    { month: 'Sep', sent: 180, delivered: 176, read: 155, replied: 80 },
    { month: 'Oct', sent: 200, delivered: 196, read: 175, replied: 92 },
    { month: 'Nov', sent: 160, delivered: 157, read: 138, replied: 72 },
    { month: 'Dec', sent: 140, delivered: 137, read: 120, replied: 65 },
  ];

  // Spike explanations
  const linkedinSpikes = {
    9: 'Connection surge due to SAP Industry Conference networking',
    5: 'Content strategy optimized by AI, increasing engagement by 218%'
  };

  const whatsappSpikes = {
    5: 'Direct messaging campaign to Fortune 500 CIOs',
    8: 'AI-powered response time optimization boosted reply rate by 423%'
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
        return 'bg-green-500/20 text-green-400 border border-green-500/20';
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
    <div className="w-full px-1 py-8 bg-[#020305] min-h-screen min-w-full relative">
      {/* Background gradient orbs */}
      <div className="fixed top-20 right-40 w-96 h-96 bg-gradient-to-br from-green-500/5 to-transparent rounded-full blur-3xl transform rotate-12 opacity-70 pointer-events-none"></div>
      <div className="fixed bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-green-500/5 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-60 pointer-events-none"></div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Header with Time Range Selector */}
          <div className="pt-4 pb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                {getChannelName(activeTab)} Analytics
              </h1>
              <p className="text-white/60 mt-2">
                {activeTab === 'email' && 'Monitor email campaign performance and AI-powered optimizations'}
                {activeTab === 'linkedin' && 'Track LinkedIn engagement and connection quality metrics'}
                {activeTab === 'whatsapp' && 'Analyze WhatsApp messaging effectiveness and response patterns'}
              </p>
            </div>
            <div className="flex gap-4">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="select select-bordered bg-[#1e222b]/50 border-white/10 text-white"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
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

          {/* AI Insights Banner */}
          {showAiInsight && (
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-green-500/15 p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-500/10 rounded-xl">
                  {aiInsights[activeTab][0].icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{aiInsights[activeTab][0].title}</h3>
                  <p className="text-white/80">{aiInsights[activeTab][0].description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-green-500 font-medium">{aiInsights[activeTab][0].change}</span>
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
                  <div className="bg-blue-500/20 p-3 rounded-full mb-2"><MdOutlinePerson className="text-blue-400 text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">1770</div>
                  <div className="text-white/60 mt-1">Contacted</div>
                </div>
                <div className={metricCardClass}>
                  <div className="bg-purple-500/20 p-3 rounded-full mb-2"><MdOutlineMailOutline className="text-purple-400 text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">338</div>
                  <div className="text-white/60 mt-1">Opened</div>
                </div>
                <div className={metricCardClass}>
                  <div className="bg-green-500/20 p-3 rounded-full mb-2"><MdOutlineReply className="text-green-400 text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">44</div>
                  <div className="text-white/60 mt-1">Replied</div>
                </div>
                <div className={metricCardClass}>
                  <div className="bg-red-500/20 p-3 rounded-full mb-2"><MdOutlineTrendingUp className="text-red-400 text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">13</div>
                  <div className="text-white/60 mt-1">Positive</div>
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
                              <div className="mt-2 text-emerald-400 text-sm font-medium flex items-center gap-2">
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
                    className={`py-2 px-4 rounded-full text-sm ${selectedFilter === 'positive' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-[#1e222b]/50 text-white/60 border border-white/10'}`}
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
                      <div className="text-2xl font-bold text-green-500">+{emailMetrics.aiOptimization.autoReplyRate}%</div>
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
                      <div className="text-2xl font-bold text-green-500">{emailMetrics.responses.positive.toLocaleString()}</div>
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
                  <div className="bg-blue-500/20 p-3 rounded-full mb-2"><MdOutlineGroups className="text-blue-400 text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">1245</div>
                  <div className="text-white/60 mt-1">Connections</div>
                </div>
                <div className={metricCardClass}>
                  <div className="bg-[#0A66C2]/20 p-3 rounded-full mb-2"><MdOutlineChat className="text-[#0A66C2] text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">867</div>
                  <div className="text-white/60 mt-1">Messages</div>
                </div>
                <div className={metricCardClass}>
                  <div className="bg-green-500/20 p-3 rounded-full mb-2"><MdOutlineReply className="text-green-400 text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">392</div>
                  <div className="text-white/60 mt-1">Replies</div>
                </div>
                <div className={metricCardClass}>
                  <div className="bg-[#0A66C2]/20 p-3 rounded-full mb-2"><MdOutlineTrendingUp className="text-[#0A66C2] text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">87</div>
                  <div className="text-white/60 mt-1">Meetings</div>
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
                              <div className="mt-2 text-emerald-400 text-sm font-medium flex items-center gap-2">
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
                      <div className="text-2xl font-bold text-green-500">{linkedinMetrics.aiOptimization.connectionQuality}%</div>
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
                </div>
                <div className={metricCardClass}>
                  <div className="bg-[#25D366]/20 p-3 rounded-full mb-2"><MdOutlineOpenInNew className="text-[#25D366] text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">1654</div>
                  <div className="text-white/60 mt-1">Read</div>
                </div>
                <div className={metricCardClass}>
                  <div className="bg-[#25D366]/20 p-3 rounded-full mb-2"><MdOutlineReply className="text-[#25D366] text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">845</div>
                  <div className="text-white/60 mt-1">Replied</div>
                </div>
                <div className={metricCardClass}>
                  <div className="bg-[#25D366]/20 p-3 rounded-full mb-2"><MdOutlineTrendingUp className="text-[#25D366] text-2xl" /></div>
                  <div className="text-3xl font-bold text-white">67</div>
                  <div className="text-white/60 mt-1">Meetings</div>
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
                              <div className="mt-2 text-emerald-400 text-sm font-medium flex items-center gap-2">
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
                      <div className="text-2xl font-bold text-green-500">{whatsappMetrics.aiOptimization.responseTime}s</div>
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
                      <div className="text-2xl font-bold text-green-500">{whatsappMetrics.responses.positive.toLocaleString()}</div>
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
  );
};

export default OutreachTracking; 