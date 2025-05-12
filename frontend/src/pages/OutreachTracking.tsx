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
    <div className="w-full px-1 py-8 bg-[#020305] min-h-screen min-w-full relative">
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
        </div>
        
        {/* Basic contents section */}
        <div className="mt-4">
          <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-green-500/15 p-6 relative overflow-hidden">
            <h2 className="text-2xl font-bold text-white mb-4">Campaign Performance</h2>
            <p className="text-white/70">View detailed analytics for your SAP migration outreach campaigns across multiple channels.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-[#1e222b]/50 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-medium mb-2">Email Campaign</h3>
                <p className="text-white/60 text-sm mb-4">Total sent: 8,456</p>
                
                <div className="flex justify-between text-sm">
                  <div>
                    <div className="text-white/60">Open rate</div>
                    <div className="text-white font-medium">44.7%</div>
                  </div>
                  <div>
                    <div className="text-white/60">Response rate</div>
                    <div className="text-white font-medium">10.3%</div>
                  </div>
                  <div>
                    <div className="text-white/60">Meetings</div>
                    <div className="text-white font-medium">143</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#1e222b]/50 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-medium mb-2">LinkedIn Campaign</h3>
                <p className="text-white/60 text-sm mb-4">Total connections: 1,245</p>
                
                <div className="flex justify-between text-sm">
                  <div>
                    <div className="text-white/60">Accept rate</div>
                    <div className="text-white font-medium">41.5%</div>
                  </div>
                  <div>
                    <div className="text-white/60">Response rate</div>
                    <div className="text-white font-medium">31.4%</div>
                  </div>
                  <div>
                    <div className="text-white/60">Meetings</div>
                    <div className="text-white font-medium">87</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#1e222b]/50 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-medium mb-2">WhatsApp Campaign</h3>
                <p className="text-white/60 text-sm mb-4">Total sent: 1,893</p>
                
                <div className="flex justify-between text-sm">
                  <div>
                    <div className="text-white/60">Read rate</div>
                    <div className="text-white font-medium">87.4%</div>
                  </div>
                  <div>
                    <div className="text-white/60">Response rate</div>
                    <div className="text-white font-medium">44.6%</div>
                  </div>
                  <div>
                    <div className="text-white/60">Meetings</div>
                    <div className="text-white font-medium">67</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
            
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
  );
};

export default OutreachTracking; 