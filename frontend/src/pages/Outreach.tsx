import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdArrowForward, MdOutlineEmail, MdScheduleSend, MdSend, MdOutlinePersonAdd, MdOutlineSettings, MdOutlineRule } from 'react-icons/md';
import { FaRegCopy, FaRegEdit, FaRegSave, FaRegTrashAlt, FaRegLightbulb, FaDatabase, FaRegChartBar, FaLinkedin, FaWhatsapp, FaMicrophone, FaComments, FaPlay } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { RiFlowChart, RiMailSendLine, RiMailCheckLine, RiMailCloseLine, RiArrowRightLine, RiSplitCellsHorizontal } from 'react-icons/ri';

interface Enterprise {
  id: number;
  name: string;
  industry: string;
  location: string;
  manager: string;
  email: string;
  phone: string;
  analysis: {
    enterpriseType: string;
    employees: number;
    sapUserRate: number;
    systemComplexity: number;
  };
  operationalAssessment: {
    annualCost: number;
    annualMaintenance: number;
  };
  migrationPotential: {
    calculated: boolean;
    totalUsers: number;
    selectedSystemType: string;
    annualSavings: number;
    migrationCost: number;
    operationalSavings: number;
    paybackPeriod: number;
    roi: number;
    monthlySavings: Array<{
      month: string;
      savings: number;
    }>;
  };
  emailStatus: {
    drafted: boolean;
    sent: boolean;
    scheduled: boolean;
    scheduledDate?: Date;
  };
}

type TabType = 'email' | 'linkedin' | 'whatsapp';

// Add WhatsApp message flow types
interface WhatsAppMessage {
  id: string;
  type: 'initial' | 'followup1' | 'followup2' | 'final';
  name: string;
  message: string;
  day: number;
}

// Add WhatsApp message templates with more structure
const whatsappFlow: WhatsAppMessage[] = [
  {
    id: 'initial',
    type: 'initial',
    name: 'Initial Contact',
    message: "Hello [name], I'm reaching out regarding [company]'s SAP migration potential. Our analysis shows significant cost savings opportunities. Would you be interested in a brief discussion?",
    day: 0
  },
  {
    id: 'followup1',
    type: 'followup1',
    name: 'First Follow-up',
    message: "Hi [name], just following up on the SAP migration analysis for [company]. The potential annual savings of $894,250 (73.5% reduction) might be of interest. When would be a good time to discuss?",
    day: 3
  },
  {
    id: 'followup2',
    type: 'followup2',
    name: 'Second Follow-up',
    message: "Hello [name], I wanted to ensure you received our analysis of [company]'s SAP migration potential. Given your focus on digital transformation, I believe our findings about 73.5% operational cost reduction would be valuable to discuss.",
    day: 5
  },
  {
    id: 'final',
    type: 'final',
    name: 'Final Message',
    message: "Hi [name], this is my final note regarding [company]'s SAP migration opportunity. Our analysis showing $894,250 in annual savings remains available if you'd like to review it in the future. Feel free to reach out when the timing is better.",
    day: 7
  }
];

const EmailAutomation = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState('independent_research');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(12);
  const [activeTab, setActiveTab] = useState<TabType>('email');
  const [selectedMessage, setSelectedMessage] = useState<WhatsAppMessage | null>(null);
  
  // Email templates
  const templates = [
    {
      id: 'ai_highest_initial',
      name: 'AI Highest Rated: Initial Contact',
      subject: "Insights from Wood's training technology presentation at TechEd Houston",
      rating: 98.7,
      sequence: 'sequence_1',
      sequencePosition: 1,
      ai_metrics: {
        openRate: 78.4,
        responseRate: 42.1,
        conversionRate: 31.5
      },
      body: `Dear Kyle,

I attended your recent presentation at the Houston TechEd conference where you discussed Wood's approach to integrating digital solutions into professional training. Your insights about leveraging technology while maintaining high-touch learning experiences particularly stood out.

This prompted our team to analyze aspects of your SAP infrastructure. Based on industry benchmarks for professional training organizations of comparable scale (42-50 IT staff, 15+ training centers), we estimate that modernizing your current SAP ECC environment to S/4HANA Cloud could potentially reduce operational costs by approximately 23.4% annually, translating to roughly $712,000 in savings for a company of Wood's size.

Our preliminary calculations suggest an implementation timeframe of 6.5 months for training companies, with ROI beginning at month 14 post-implementation. With SAP ECC support ending in 2027, this timeline puts you well ahead of critical deadlines.

These projections derive from analysis of 8 similar migrations across professional training organizations with comparable data complexity and certification tracking requirements.

Hope this perspective proves useful for your IT modernization planning.

Regards,
Alex Peterson`
    },
    {
      id: 'ai_highest_followup1',
      name: 'AI Highest Rated: Follow-up 1',
      subject: "Quick follow-up: Wood's SAP migration potential",
      rating: 97.9,
      sequence: 'sequence_1',
      sequencePosition: 2,
      ai_metrics: {
        openRate: 82.1,
        responseRate: 38.4,
        conversionRate: 26.9
      },
      body: `Hi Kyle,

Following up briefly on my previous email about Wood's potential SAP migration benefits.

I wanted to share that our recent analysis of training sector implementations shows particularly strong results for companies that integrate their training certification tracking with S/4HANA. Organizations similar to Wood have seen 43% faster processing of certification data and 37% reduction in compliance reporting time.

If you're interested in these findings, I'd be happy to forward our industry benchmark report.

Best,
Alex`
    },
    {
      id: 'ai_highest_followup2',
      name: 'AI Highest Rated: Follow-up 2',
      subject: "Final thoughts on Wood's SAP migration opportunity",
      rating: 96.2,
      sequence: 'sequence_1',
      sequencePosition: 3,
      ai_metrics: {
        openRate: 79.6,
        responseRate: 31.2,
        conversionRate: 18.7
      },
      body: `Dear Kyle,

I'm reaching out one final time regarding the SAP migration analysis we conducted for Wood.

Since my last email, we've completed an additional study of professional training companies who recently underwent SAP migrations. The data revealed three particularly relevant findings for your Houston operations:

1. Training companies with sophisticated certification tracking requirements (which we understand is central to Wood's business model) achieved 28% greater ROI compared to general industry averages.

2. The implementation timeline for companies that maintained parallel systems during migration averaged just 5.7 months - nearly 40% faster than standard approaches.

3. Integration with virtual training environments (which featured prominently in your TechEd presentation) was completed with minimal disruption, with 92% of companies reporting zero downtime for learner-facing systems.

The full dataset encompasses 14 professional training organizations across North America, with an average size of 750-1,200 employees and annual IT budgets of $4.2-7.1M.

Should these findings align with your current modernization priorities, our complete analysis remains available.

Wishing you continued success with Wood's digital initiatives.

Regards,
Alex Peterson`
    },
    {
      id: 'sequence2_initial',
      name: 'Value-Focused: Initial Contact',
      subject: "Wood training technology modernization - potential $712K annual savings",
      rating: 92.4,
      sequence: 'sequence_2',
      sequencePosition: 1,
      ai_metrics: {
        openRate: 71.3,
        responseRate: 36.8,
        conversionRate: 24.5
      },
      body: `Dear Kyle,

Your recent interview in Training Technology Quarterly about Wood's learning platform innovations caught my attention, particularly your emphasis on creating seamless digital experiences for professional certifications.

After reviewing your technical infrastructure based on publicly available information, our team has identified potential optimization opportunities within your SAP environment. For professional training organizations like Wood with 5+ years on ECC systems, migration to S/4HANA typically yields annual operational savings between $650K-850K, with an implementation timeline of 6-8 months.

Key areas of improvement specific to training companies include:
• 67% faster certification processing and validation
• 73% reduction in manual data entry requirements
• 42% more efficient compliance reporting for regulated industries
• Enhanced integration with virtual learning environments

With SAP ECC end-of-support approaching in 2027, organizations in your sector are typically allowing 12-18 months for complete transition. Based on Wood's scale and complexity, our projected implementation would complete by Q2 2026, providing a comfortable buffer before support expires.

These insights come from our analysis of 14 similar migrations within professional training and education companies during 2021-2023.

I hope this information proves valuable as you evaluate your technology roadmap.

Regards,
Alex Peterson`
    },
    {
      id: 'sequence2_followup1',
      name: 'Value-Focused: Follow-up 1',
      subject: "RE: Wood's SAP environment - specific training industry findings",
      rating: 89.5,
      sequence: 'sequence_2',
      sequencePosition: 2,
      ai_metrics: {
        openRate: 68.7,
        responseRate: 31.4,
        conversionRate: 19.8
      },
      body: `Kyle,

I wanted to follow up on my previous email with some additional findings specifically relevant to Wood's professional training operations in Houston.

In analyzing similar companies that migrated from ECC to S/4HANA:

- Training organizations with certification requirements saw average processing time improvements of 43% for student record management
- Companies integrating virtual classrooms experienced 87% faster data synchronization
- Houston-based enterprises benefited from local implementation partners, reducing project timelines by 23% compared to national averages

If any of these areas align with your current challenges, I'd be happy to share the detailed findings from our industry analysis.

Best regards,
Alex`
    },
    {
      id: 'problem_solution',
      name: 'Problem-Solution: Initial Contact',
      subject: "Addressing Wood's training certification challenges with SAP modernization",
      rating: 86.3,
      sequence: 'sequence_3',
      sequencePosition: 1,
      ai_metrics: {
        openRate: 65.9,
        responseRate: 28.7,
        conversionRate: 17.4
      },
      body: `Dear Kyle,

I recently reviewed Wood's impressive growth in professional certification programs as highlighted in the Houston Business Journal. Your expansion into specialized industrial safety training particularly stands out in a competitive market.

This prompted our research team to examine how similar training organizations are addressing technology challenges during growth phases. Our industry analysis reveals that companies with comparable certification volumes (12,000-18,000 annually) face three primary challenges with legacy SAP implementations:

1. Certification tracking becomes increasingly manual as volume scales, with staff spending 23-37 hours weekly on data validation

2. Reporting for regulatory compliance requires extensive customization, typically costing $140K-190K annually in development resources

3. Integration with modern learning management systems creates synchronization issues, with error rates averaging 4-8% in cross-platform data

In examining Wood's public technology footprint, we identified several indicators suggesting these challenges may be relevant to your operations. Professional training organizations that have addressed these issues through SAP modernization typically achieve:

• 71% reduction in manual certification processing time
• 83% decrease in compliance reporting development costs
• 92% improved accuracy in cross-platform data synchronization

These findings stem from our analysis of 17 professional training organizations that modernized legacy SAP systems between 2020-2023.

I hope this perspective provides valuable context for your technology strategy.

Regards,
Alex Peterson`
    }
  ];
  
  // Contact data - SAP/Cloud leadership contacts
  const contacts = [
    {
      id: 1,
      name: "Kyle Flynn-Kasaba",
      email: "k.flynn@wood.com",
      company: "Wood",
      location: "Houston, Texas",
      position: "Head of IT Infrastructure and Operations",
      phone: "+1 (713) 555-1234"
    },
    {
      id: 2,
      name: "Wells Shammout",
      email: "w.shammout@ips.com",
      company: "IPS",
      location: "Rutherford, New Jersey",
      position: "Vice President, Head of Information Technology",
      phone: "+1 (201) 555-2345"
    },
    {
      id: 3,
      name: "Sanjeev Sharma",
      email: "s.sharma@ipgphotonics.com",
      company: "IPG Photonics",
      location: "Framingham, Massachusetts",
      position: "Head of Information Technology - Info",
      phone: "+1 (508) 555-3456"
    },
    {
      id: 4,
      name: "Leah Sullivan",
      email: "l.sullivan@henkel.com",
      company: "Henkel",
      location: "Watchung, New Jersey",
      position: "Head of IT application Engineering",
      phone: "+1 (908) 555-4567"
    },
    {
      id: 5,
      name: "Benjamin Partout",
      email: "b.partout@strive.com",
      company: "Strive",
      location: "Denver, Colorado",
      position: "Head of Information Technology",
      phone: "+1 (303) 555-5678"
    },
    {
      id: 6,
      name: "Henry Ifiuscati",
      email: "h.ifiuscati@libertymutual.com",
      company: "Liberty Mutual Insurance",
      location: "Boston, Massachusetts",
      position: "Head of Information Technology",
      phone: "+1 (617) 555-6789"
    },
    {
      id: 7,
      name: "Brandon Thielen",
      email: "b.thielen@fivescinetic.com",
      company: "Fives Cinetic Corp.",
      location: "Farmington, Michigan",
      position: "Head of Information Technology",
      phone: "+1 (248) 555-7890"
    },
    {
      id: 8,
      name: "Tayo Oshoel",
      email: "t.oshoel@holcim.com",
      company: "Holcim",
      location: "Washington, District of Columbia",
      position: "Head of Information Technology",
      phone: "+1 (202) 555-8901"
    }
  ];

  // Add LinkedIn voice message template
  const linkedInVoiceMessage = {
    id: 'linkedin_voice',
    name: 'LinkedIn Voice Message',
    message: `Hi {{name}},

I noticed your recent post about {{company}}'s SAP migration journey and was particularly impressed by your insights on balancing legacy systems with innovation.

After analyzing your current SAP environment, I've identified some compelling opportunities for optimization. Specifically, with your 1,250 SAP users, a migration to S/4HANA Cloud could reduce your annual operational costs by approximately $894,250 - that's a 73.5% reduction.

I'd love to share a detailed analysis of how this could work for {{company}}. Would you be open to a brief conversation?

Best regards,
[Your Name]`
  };

  // Add WhatsApp message templates
  const whatsappTemplates = [
    {
      id: 'initial_contact',
      name: 'Initial Contact',
      message: "Hello [name], I'm reaching out regarding [company]'s SAP migration potential. Our analysis shows significant cost savings opportunities. Would you be interested in a brief discussion?"
    },
    {
      id: 'follow_up',
      name: 'Follow-up',
      message: "Hi [name], just following up on the SAP migration analysis for [company]. The potential annual savings of $894,250 (73.5% reduction) might be of interest. When would be a good time to discuss?"
    }
  ];

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      
      // Set default template
      const defaultTemplate = templates.find(t => t.id === 'ai_highest_initial');
      if (defaultTemplate) {
        setEmailSubject(defaultTemplate.subject);
        setEmailBody(defaultTemplate.body);
      }
      
      // Set default selected contacts
      setSelectedContacts([contacts[0].name]);
      
      // Default scheduled date/time (tomorrow at 9am)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setScheduledDate(tomorrow.toISOString().split('T')[0]);
      setScheduledTime('09:00');
    }, 1000);
  }, []);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setEmailSubject(template.subject);
      setEmailBody(template.body);
    }
  };

  const handleContactToggle = (name: string) => {
    setSelectedContacts(prev => {
      if (prev.includes(name)) {
        return prev.filter(n => n !== name);
      } else {
        return [...prev, name];
      }
    });
  };

  const handleSendEmails = () => {
    if (selectedContacts.length === 0) {
      toast.error('Please select at least one contact');
      return;
    }
    
    toast.success(`${selectedContacts.length} emails scheduled for ${scheduledDate} at ${scheduledTime}`);
    
    // Navigate to outreach tracking after a short delay
    setTimeout(() => {
      navigate('/outreach-tracking');
    }, 1500);
  };

  const handleContinueToOutreachTracking = () => {
    navigate('/outreach-tracking');
  };

  const personalize = (text: string, contact: any) => {
    return text
      .replace(/{{name}}/g, contact.name)
      .replace(/{{company}}/g, contact.company)
      .replace(/{{location}}/g, contact.location)
      .replace(/{{position}}/g, contact.position);
  };

  const showModal = (messageType: 'initial' | 'followup1' | 'followup2' | 'final') => {
    const message = whatsappFlow.find(m => m.type === messageType);
    if (message) {
      setSelectedMessage(message);
      const modal = document.getElementById('message-preview') as HTMLDialogElement;
      if (modal) modal.showModal();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020305] flex items-center justify-center relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="fixed top-20 right-40 w-96 h-96 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full blur-3xl transform rotate-12 opacity-70 pointer-events-none"></div>
        <div className="fixed bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-emerald-500/5 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-60 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="loading loading-spinner loading-lg text-emerald-500 relative"></div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Loading Email Automation</h2>
            <p className="text-white/60">Preparing your email templates and contacts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white px-1 py-8">
      <div className="max-w-[1800px] mx-auto">
        {/* Title */}
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-4 rounded-xl text-white shadow-lg">
                    <MdOutlineEmail size={24} />
                  </div>
          <h1 className="text-2xl font-bold text-white">Outreach</h1>
                </div>
                
        {/* Main Tabs */}
        <div className="grid grid-cols-3 gap-4 mb-6 px-2">
          {/* Email Tab */}
          <button
            onClick={() => setActiveTab('email')}
            className={`backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-emerald-500/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 ${
              activeTab === 'email' ? 'ring-2 ring-emerald-500' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                <MdOutlineEmail size={24} />
                        </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Email Outreach</h2>
                <p className="text-white/60 text-sm">Personalized email campaigns</p>
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
                <p className="text-white/60 text-sm">Voice messages and connections</p>
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
              <div className="bg-gradient-to-br from-[#25D366] to-[#128C7E] p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                <FaWhatsapp size={24} />
                    </div>
                    <div>
                <h2 className="text-lg font-semibold text-white">WhatsApp Outreach</h2>
                <p className="text-white/60 text-sm">Direct messaging campaigns</p>
                    </div>
                      </div>
          </button>
                    </div>
                    
        {/* Tab Content */}
        <div className="space-y-6 px-2">
          {/* Email Content */}
          {activeTab === 'email' && (
            <>
              {/* Email Editor */}
              <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-emerald-500/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email Editor */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                        <FaRegEdit size={24} />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-white">Email Editor</h2>
                        <p className="text-white/60 text-sm">Craft your message</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Template Selection UI */}
                      <div className="bg-gradient-to-br from-[#1e222b]/80 to-[#1e222b]/50 rounded-lg border border-emerald-500/10 p-4">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="bg-emerald-500/20 p-2 rounded">
                            <FaRegLightbulb className="text-emerald-400" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-white">AI-Recommended Templates</h3>
                            <p className="text-xs text-white/60">Our AI has analyzed performance metrics to suggest the most effective templates</p>
                          </div>
                          <div className="ml-auto bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                            <span className="text-xs text-emerald-400 font-medium">Self-improving AI</span>
                          </div>
                        </div>

                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                          {/* Template Sequence 1 */}
                          <div className="space-y-2">
                            <div className="text-white/80 text-xs font-medium flex items-center gap-1">
                              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                              High-Conversion Sequence
                            </div>
                            
                            {templates
                              .filter(t => t.sequence === 'sequence_1')
                              .sort((a, b) => a.sequencePosition - b.sequencePosition)
                              .map(template => (
                                <button
                                  key={template.id}
                                  onClick={() => handleTemplateChange(template.id)}
                                  className={`w-full flex items-center p-2 rounded text-left hover:bg-[#28292b]/60 transition-colors ${
                                    selectedTemplate === template.id ? 'bg-[#28292b]/80 border border-emerald-500/30' : 'bg-[#28292b]/40'
                                  }`}
                                >
                                  <div className="flex-1">
                                    <p className="text-sm text-white truncate">{template.name}</p>
                                    <p className="text-xs text-white/60 truncate">Open rate: <span className="text-emerald-400">{template.ai_metrics.openRate}%</span></p>
                                  </div>
                                  <div className="text-xs bg-emerald-500/20 px-2 py-1 rounded">
                                    <span className="text-emerald-400 font-medium">{template.rating.toFixed(1)}%</span>
                                  </div>
                                </button>
                              ))}
                          </div>
                          
                          {/* Template Sequence 2 */}
                          <div className="space-y-2 pt-2 border-t border-white/10">
                            <div className="text-white/80 text-xs font-medium flex items-center gap-1">
                              <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                              Value-Focused Sequence
                            </div>
                            
                            {templates
                              .filter(t => t.sequence === 'sequence_2')
                              .sort((a, b) => a.sequencePosition - b.sequencePosition)
                              .map(template => (
                                <button
                                  key={template.id}
                                  onClick={() => handleTemplateChange(template.id)}
                                  className={`w-full flex items-center p-2 rounded text-left hover:bg-[#28292b]/60 transition-colors ${
                                    selectedTemplate === template.id ? 'bg-[#28292b]/80 border border-blue-500/30' : 'bg-[#28292b]/40'
                                  }`}
                                >
                                  <div className="flex-1">
                                    <p className="text-sm text-white truncate">{template.name}</p>
                                    <p className="text-xs text-white/60 truncate">Open rate: <span className="text-blue-400">{template.ai_metrics.openRate}%</span></p>
                                  </div>
                                  <div className="text-xs bg-blue-500/20 px-2 py-1 rounded">
                                    <span className="text-blue-400 font-medium">{template.rating.toFixed(1)}%</span>
                                  </div>
                                </button>
                              ))}
                          </div>
                          
                          {/* Problem-Solution (Single) */}
                          <div className="space-y-2 pt-2 border-t border-white/10">
                            <div className="text-white/80 text-xs font-medium flex items-center gap-1">
                              <span className="inline-block w-2 h-2 rounded-full bg-purple-500"></span>
                              Problem-Solution Approach
                            </div>
                            
                            {templates
                              .filter(t => t.sequence === 'sequence_3')
                              .map(template => (
                                <button
                                  key={template.id}
                                  onClick={() => handleTemplateChange(template.id)}
                                  className={`w-full flex items-center p-2 rounded text-left hover:bg-[#28292b]/60 transition-colors ${
                                    selectedTemplate === template.id ? 'bg-[#28292b]/80 border border-purple-500/30' : 'bg-[#28292b]/40'
                                  }`}
                                >
                                  <div className="flex-1">
                                    <p className="text-sm text-white truncate">{template.name}</p>
                                    <p className="text-xs text-white/60 truncate">Open rate: <span className="text-purple-400">{template.ai_metrics.openRate}%</span></p>
                                  </div>
                                  <div className="text-xs bg-purple-500/20 px-2 py-1 rounded">
                                    <span className="text-purple-400 font-medium">{template.rating.toFixed(1)}%</span>
                                  </div>
                                </button>
                              ))}
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                          <div className="text-xs text-white/60">
                            <span className="text-emerald-400 font-medium">AI Insight:</span> Personalized subject lines have increased open rates by 37.8%
                          </div>
                          <button className="btn btn-xs bg-gradient-to-br from-[#28292b]/80 to-[#28292b]/60 text-white border border-emerald-500/20">
                            View all templates
                          </button>
                        </div>
                      </div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-white/80">Subject</span>
                          <span className="label-text-alt text-green-400 flex items-center gap-1 text-xs">
                            <FaRegLightbulb size={10} />
                            <span>+23% opens with personalization</span>
                          </span>
                        </label>
                        <input 
                          type="text" 
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          className="input w-full backdrop-blur-md bg-[#28292b]/60 border border-emerald-500/20 text-white focus:border-emerald-500"
                        />
                      </div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-white/80">Email Body</span>
                          <span className="label-text-alt text-green-400 flex items-center gap-1 text-xs">
                            <FaRegLightbulb size={10} />
                            <span>~120 words optimal</span>
                          </span>
                        </label>
                        <textarea 
                          value={emailBody}
                          onChange={(e) => setEmailBody(e.target.value)}
                          className="textarea h-96 backdrop-blur-md bg-[#28292b]/60 border border-emerald-500/20 text-white focus:border-emerald-500"
                        />
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <button className="btn btn-sm bg-gradient-to-br from-[#28292b]/80 to-[#28292b]/60 hover:from-[#28292b]/90 hover:to-[#28292b]/70 text-white border border-emerald-500/20 gap-2 shadow-lg hover:shadow-emerald-500/10 transition-all">
                          <FaRegCopy size={16} />
                          Copy
                        </button>
                        <button className="btn btn-sm bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-0 gap-2 shadow-lg hover:shadow-emerald-500/20 transition-all">
                          <FaRegSave size={16} />
                          Save as Template
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Email Preview */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                        <MdOutlineEmail size={24} />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-white">Email Preview</h2>
                        <p className="text-white/60 text-sm">How recipients will see it</p>
                      </div>
                    </div>
                    
                    <div>
                      {selectedContacts.length > 0 ? (
                        <div className="backdrop-blur-md bg-[#28292b]/40 rounded-lg p-4 border border-emerald-500/10">
                          <div className="mb-2 text-white/80 flex items-center gap-2">
                            <span className="font-medium">To:</span>
                            <div className="flex items-center gap-1">
                              <span className="bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 text-white">{contacts.find(c => c.name === selectedContacts[0])?.email}</span>
                              {selectedContacts.length > 1 && (
                                <span className="bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 text-white">+{selectedContacts.length - 1} more</span>
                              )}
                            </div>
                          </div>
                          <div className="mb-4 text-white/80">
                            <span className="font-medium">Subject:</span>
                            <div className="bg-emerald-500/10 px-3 py-2 rounded mt-1 border border-emerald-500/20 text-white">
                              {personalize(emailSubject, contacts.find(c => c.name === selectedContacts[0]))}
                            </div>
                          </div>
                          <div className="whitespace-pre-line border-t border-emerald-500/20 pt-4 text-white">
                            {personalize(emailBody, contacts.find(c => c.name === selectedContacts[0]))}
                          </div>
                          
                          {/* AI Insights Panel */}
                          <div className="mt-6 pt-4 border-t border-emerald-500/20">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="text-emerald-500">
                                <FaRegLightbulb size={18} />
                              </div>
                              <h3 className="text-white text-sm font-medium">AI Message Analysis</h3>
                              <div className="ml-auto bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                                <span className="text-xs text-emerald-400 font-medium">Continually learning</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-[#1e222b]/50 p-3 rounded-lg border border-emerald-500/5">
                                <div className="text-xs text-white/60 mb-1">Readability Score</div>
                                <div className="flex items-center justify-between">
                                  <div className="text-white font-medium">Excellent</div>
                                  <div className="text-emerald-400 font-medium">92/100</div>
                                </div>
                                <div className="w-full h-1.5 bg-[#28292b] rounded-full mt-1 overflow-hidden">
                                  <div className="h-full w-[92%] bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"></div>
                                </div>
                              </div>
                              
                              <div className="bg-[#1e222b]/50 p-3 rounded-lg border border-emerald-500/5">
                                <div className="text-xs text-white/60 mb-1">Predicted Open Rate</div>
                                <div className="flex items-center justify-between">
                                  <div className="text-white font-medium">High</div>
                                  <div className="text-emerald-400 font-medium">78.4%</div>
                                </div>
                                <div className="w-full h-1.5 bg-[#28292b] rounded-full mt-1 overflow-hidden">
                                  <div className="h-full w-[78.4%] bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"></div>
                                </div>
                              </div>
                              
                              <div className="bg-[#1e222b]/50 p-3 rounded-lg border border-emerald-500/5">
                                <div className="text-xs text-white/60 mb-1">CTR Prediction</div>
                                <div className="flex items-center justify-between">
                                  <div className="text-white font-medium">Above Average</div>
                                  <div className="text-emerald-400 font-medium">42.1%</div>
                                </div>
                                <div className="w-full h-1.5 bg-[#28292b] rounded-full mt-1 overflow-hidden">
                                  <div className="h-full w-[42.1%] bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"></div>
                                </div>
                              </div>
                              
                              <div className="bg-[#1e222b]/50 p-3 rounded-lg border border-emerald-500/5">
                                <div className="text-xs text-white/60 mb-1">Meeting Conversion</div>
                                <div className="flex items-center justify-between">
                                  <div className="text-white font-medium">Outstanding</div>
                                  <div className="text-emerald-400 font-medium">31.5%</div>
                                </div>
                                <div className="w-full h-1.5 bg-[#28292b] rounded-full mt-1 overflow-hidden">
                                  <div className="h-full w-[31.5%] bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"></div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-3 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded text-xs text-white/80">
                              <span className="text-emerald-400 font-medium">AI Recommendation:</span> This message is optimized for Kyle Flynn's profile as Head of IT at Wood. The specific mention of training industry challenges increases relevance by 47%.
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12 backdrop-blur-md bg-[#28292b]/40 rounded-lg border border-emerald-500/10">
                          <div className="text-emerald-500 mb-4">
                            <MdOutlineEmail size={48} className="mx-auto" />
                          </div>
                          <p className="text-white/60">
                            Select a contact to preview the personalized email
                          </p>
                        </div>
                      )}
                </div>
              </div>
            </div>
          </div>

          {/* Email Sequencing Visualization */}
          <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-emerald-500/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                <RiFlowChart size={24} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Email Sequencing</h2>
                <p className="text-white/60 text-sm">Automated follow-up flow based on recipient actions</p>
              </div>
              <div className="ml-auto">
                <button className="btn btn-sm bg-gradient-to-br from-[#28292b]/80 to-[#28292b]/60 hover:from-[#28292b]/90 hover:to-[#28292b]/70 text-white border border-emerald-500/20 gap-2 shadow-lg hover:shadow-emerald-500/10 transition-all">
                  <RiSplitCellsHorizontal size={16} />
                  Edit Sequence
                </button>
              </div>
            </div>
            
            <div className="mt-6 relative">
              {/* Flow diagram for email sequence */}
              <div className="flex flex-wrap justify-between items-center gap-4 px-4">
                {/* Initial Email */}
                <div className="relative flex flex-col items-center w-40">
                  <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-4 border border-emerald-500/20 relative group/node">
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-green-500/5 to-emerald-600/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                    <div className="flex flex-col items-center gap-2">
                      <RiMailSendLine size={28} className="text-emerald-400" />
                      <div className="text-white text-center font-medium">Initial Email</div>
                      <div className="text-xs text-white/60 text-center">Day 0</div>
                    </div>
                  </div>
                  <div className="h-8 w-1 bg-gradient-to-b from-emerald-500 to-emerald-300 mt-2"></div>
                </div>
                
                {/* Conditional: Opened? */}
                <div className="relative flex flex-col items-center">
                  <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl py-3 px-4 border border-emerald-500/20 relative group/node">
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-green-500/5 to-emerald-600/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                    <div className="text-white text-center text-sm font-medium">Opened?</div>
                  </div>
                  
                  {/* Yes/No paths */}
                  <div className="flex gap-10 mt-2">
                    <div className="flex flex-col items-center">
                      <div className="h-6 w-1 bg-green-500"></div>
                      <div className="text-green-400 text-xs">Yes</div>
                      <div className="h-6 w-1 bg-green-500"></div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-6 w-1 bg-red-500"></div>
                      <div className="text-red-400 text-xs">No</div>
                      <div className="h-6 w-1 bg-red-500"></div>
                    </div>
                  </div>
                </div>
                
                {/* Follow-up Email 1 */}
                <div className="relative flex flex-col items-center w-40">
                  <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-4 border border-emerald-500/20 relative group/node">
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-green-500/5 to-emerald-600/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                    <div className="flex flex-col items-center gap-2">
                      <RiMailCloseLine size={28} className="text-emerald-400" />
                      <div className="text-white text-center font-medium">Follow-up Email 1</div>
                      <div className="text-xs text-white/60 text-center">Day 3</div>
                    </div>
                  </div>
                  <div className="h-8 w-1 bg-gradient-to-b from-emerald-500 to-emerald-300 mt-2"></div>
                </div>
                
                {/* Conditional: Replied? */}
                <div className="relative flex flex-col items-center">
                  <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl py-3 px-4 border border-emerald-500/20 relative group/node">
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-green-500/5 to-emerald-600/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                    <div className="text-white text-center text-sm font-medium">Replied?</div>
                  </div>
                  
                  {/* Yes/No paths */}
                  <div className="flex gap-10 mt-2">
                    <div className="flex flex-col items-center">
                      <div className="h-6 w-1 bg-green-500"></div>
                      <div className="text-green-400 text-xs">Yes</div>
                      <div className="h-6 w-1 bg-green-500"></div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-6 w-1 bg-red-500"></div>
                      <div className="text-red-400 text-xs">No</div>
                      <div className="h-6 w-1 bg-red-500"></div>
                    </div>
                  </div>
                </div>
                
                {/* Follow-up Email 2 */}
                <div className="relative flex flex-col items-center w-40">
                  <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-4 border border-emerald-500/20 relative group/node">
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-green-500/5 to-emerald-600/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                    <div className="flex flex-col items-center gap-2">
                      <RiMailCloseLine size={28} className="text-emerald-400" />
                      <div className="text-white text-center font-medium">Follow-up Email 2</div>
                          <div className="text-xs text-white/60 text-center">Day 5</div>
                        </div>
                      </div>
                    </div>

                    {/* Final Message */}
                    <div className="relative flex flex-col items-center w-40">
                      <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-4 border border-[#25D366]/20 relative group/node hover:border-[#25D366]/40 cursor-pointer transition-all"
                           onClick={() => showModal('final')}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#25D366]/10 via-[#128C7E]/5 to-[#25D366]/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                        <div className="flex flex-col items-center gap-2">
                          <FaWhatsapp size={28} className="text-[#25D366]" />
                          <div className="text-white text-center font-medium">Final Message</div>
                      <div className="text-xs text-white/60 text-center">Day 7</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom row outcomes */}
              <div className="mt-12 flex justify-center gap-12">
                <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-4 border border-green-500/20 relative group/node">
                  <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 via-green-300/5 to-green-600/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                  <div className="flex flex-col items-center gap-2">
                    <RiMailCheckLine size={24} className="text-green-400" />
                    <div className="text-white text-center font-medium">Move to Opportunities</div>
                  </div>
                </div>
                
                <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-4 border border-emerald-500/20 relative group/node">
                      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-green-500/5 to-emerald-600/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                  <div className="flex flex-col items-center gap-2">
                    <RiMailCloseLine size={24} className="text-emerald-400" />
                    <div className="text-white text-center font-medium">Final Email</div>
                    <div className="text-xs text-white/60 text-center">Day 14</div>
                  </div>
                </div>
              </div>
              
              {/* Visual connecting lines */}
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
                  </marker>
                </defs>
              </svg>
              
              {/* Stats about the sequence */}
              <div className="mt-8 grid grid-cols-4 gap-4">
                <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-lg p-3 border border-emerald-500/10">
                  <div className="text-sm text-emerald-400 mb-1">Average Sequence Length</div>
                  <div className="text-lg text-white font-bold">9 days</div>
                </div>
                <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-lg p-3 border border-emerald-500/10">
                  <div className="text-sm text-emerald-400 mb-1">Response Rate</div>
                  <div className="text-lg text-white font-bold">30% by 2nd email</div>
                </div>
                <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-lg p-3 border border-emerald-500/10">
                  <div className="text-sm text-emerald-400 mb-1">Meeting Bookings</div>
                  <div className="text-lg text-white font-bold">15% conversion</div>
                </div>
                <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-lg p-3 border border-emerald-500/10">
                  <div className="text-sm text-emerald-400 mb-1">Complete Sequence</div>
                  <div className="text-lg text-white font-bold">40% of contacts</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Database Section - Added for Email tab */}
          <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-emerald-500/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                <FaDatabase className="text-lg text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Contact Database</h2>
                <p className="text-white/60 text-sm">Select your SAP migration audience from 2,347 verified contacts</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <div className="bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs text-emerald-500 font-medium">AI Optimized</span>
                </div>
                <div className="bg-orange-500/20 px-3 py-1 rounded-full border border-orange-500/30">
                  <span className="text-xs text-orange-400 font-medium">42% avg. open rate</span>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="table table-sm w-full">
                <thead>
                  <tr className="border-b border-emerald-500/20">
                    <th className="w-10 bg-[#28292b]/80 text-white/80">
                      <input type="checkbox" className="checkbox checkbox-xs checkbox-success" />
                    </th>
                    <th className="bg-[#28292b]/80 text-white/80">Name</th>
                    <th className="bg-[#28292b]/80 text-white/80">Email</th>
                    <th className="bg-[#28292b]/80 text-white/80">Company</th>
                    <th className="bg-[#28292b]/80 text-white/80">Position</th>
                    <th className="bg-[#28292b]/80 text-white/80 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-[#28292b]/40 border-b border-emerald-500/10">
                    <td>
                      <input type="checkbox" className="checkbox checkbox-xs checkbox-success" checked />
                    </td>
                    <td className="font-medium text-white">{contacts[0].name}</td>
                    <td className="text-white/80">{contacts[0].email}</td>
                    <td>{contacts[0].company}</td>
                    <td className="text-white/80">{contacts[0].position}</td>
                    <td className="text-right">
                      <span className="text-emerald-400 text-sm">Opened previous email</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#28292b]/40 border-b border-emerald-500/10">
                    <td>
                      <input type="checkbox" className="checkbox checkbox-xs checkbox-success" />
                    </td>
                    <td className="font-medium text-white">{contacts[1].name}</td>
                    <td className="text-white/80">{contacts[1].email}</td>
                    <td>{contacts[1].company}</td>
                    <td className="text-white/80">{contacts[1].position}</td>
                    <td className="text-right">
                      <span className="text-blue-400 text-sm">New contact</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#28292b]/40 border-b border-emerald-500/10">
                    <td>
                      <input type="checkbox" className="checkbox checkbox-xs checkbox-success" checked />
                    </td>
                    <td className="font-medium text-white">{contacts[2].name}</td>
                    <td className="text-white/80">{contacts[2].email}</td>
                    <td>{contacts[2].company}</td>
                    <td className="text-white/80">{contacts[2].position}</td>
                    <td className="text-right">
                      <span className="text-emerald-400 text-sm">Opened previous email</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#28292b]/40 border-b border-emerald-500/10">
                    <td>
                      <input type="checkbox" className="checkbox checkbox-xs checkbox-success" />
                    </td>
                    <td className="font-medium text-white">{contacts[3].name}</td>
                    <td className="text-white/80">{contacts[3].email}</td>
                    <td>{contacts[3].company}</td>
                    <td className="text-white/80">{contacts[3].position}</td>
                    <td className="text-right">
                      <span className="text-yellow-400 text-sm">Clicked link</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#28292b]/40 border-b border-emerald-500/10">
                    <td>
                      <input type="checkbox" className="checkbox checkbox-xs checkbox-success" />
                    </td>
                    <td className="font-medium text-white">{contacts[4].name}</td>
                    <td className="text-white/80">{contacts[4].email}</td>
                    <td>{contacts[4].company}</td>
                    <td className="text-white/80">{contacts[4].position}</td>
                    <td className="text-right"></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="text-white/60 text-sm">2 contacts selected from {contacts.length} total</div>
              <div className="flex gap-2">
                <div className="join">
                  <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-emerald-500/20">«</button>
                  <button className="join-item btn btn-sm bg-emerald-500 text-white border-emerald-500">1</button>
                  <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-emerald-500/20">2</button>
                  <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-emerald-500/20">3</button>
                  <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-emerald-500/20">4</button>
                  <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-emerald-500/20">5</button>
                  <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-emerald-500/20">»</button>
                </div>
                <button className="btn btn-sm bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-0 gap-2 shadow-lg hover:shadow-emerald-500/20 transition-all">
                  Import Contacts
                </button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="text-emerald-500">
                  <MdOutlineSettings className="text-xl animate-spin-slow" />
                </div>
                <div>
                  <p className="text-sm text-white/90">
                    <span className="font-medium text-emerald-400">AI-powered SAP insights:</span> Our intelligent system has analyzed your contacts and identified <span className="text-emerald-400 font-medium">78 SAP ECC 6.0 enterprises</span> with a high likelihood of migration needs before 2027. These contacts have been prioritized based on their current system complexity and maintenance costs.
                  </p>
                </div>
              </div>
            </div>
          </div>
            </>
          )}

          {/* LinkedIn Content */}
          {activeTab === 'linkedin' && (
            <>
              {/* LinkedIn Voice Message Section */}
              <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-[#0A66C2]/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-[#0A66C2] to-[#0A66C2]/80 p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                    <FaLinkedin size={24} />
              </div>
              <div>
                    <h2 className="text-lg font-semibold text-white">LinkedIn Voice Message</h2>
                    <p className="text-white/60 text-sm">Personalized voice messages for higher engagement</p>
              </div>
            </div>
            
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Message Preview */}
                  <div className="backdrop-blur-md bg-[#28292b]/40 rounded-lg p-4 border border-[#0A66C2]/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#0A66C2]/80 flex items-center justify-center">
                        <FaLinkedin size={20} className="text-white" />
                    </div>
                      <div>
                        <h3 className="text-white font-medium">Message Preview</h3>
                        <p className="text-white/60 text-sm">Personalized for each recipient</p>
                    </div>
                    </div>
                    <div className="bg-[#1A1A1A] rounded-lg p-4 text-white/80 text-sm whitespace-pre-line">
                      {linkedInVoiceMessage.message}
                  </div>
              </div>
              
                  {/* Audio Simulation */}
                  <div className="backdrop-blur-md bg-[#28292b]/40 rounded-lg p-4 border border-[#0A66C2]/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#0A66C2]/80 flex items-center justify-center">
                        <FaMicrophone size={20} className="text-white" />
                </div>
                      <div>
                        <h3 className="text-white font-medium">Voice Simulation</h3>
                        <p className="text-white/60 text-sm">Click to hear the message</p>
                      </div>
                    </div>
                    <div className="bg-[#1A1A1A] rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button className="w-12 h-12 rounded-full bg-[#0A66C2] hover:bg-[#0A66C2]/80 flex items-center justify-center transition-colors">
                            <FaPlay size={20} className="text-white" />
                </button>
                          <div className="text-white">Voice Message</div>
              </div>
                        <div className="text-white/60 text-sm">0:45</div>
                      </div>
                      <div className="mt-4 h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
                        <div className="h-full w-0 bg-[#0A66C2] rounded-full animate-pulse"></div>
                      </div>
                    </div>
            </div>
          </div>

                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-lg p-3 border border-[#0A66C2]/10">
                    <div className="text-sm text-[#0A66C2] mb-1">Voice Message Impact</div>
                    <div className="text-lg text-white font-bold">+45% engagement</div>
                  </div>
                  <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-lg p-3 border border-[#0A66C2]/10">
                    <div className="text-sm text-[#0A66C2] mb-1">Response Rate</div>
                    <div className="text-lg text-white font-bold">32% reply rate</div>
                  </div>
                  <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-lg p-3 border border-[#0A66C2]/10">
                    <div className="text-sm text-[#0A66C2] mb-1">Meeting Conversion</div>
                    <div className="text-lg text-white font-bold">18% to meeting</div>
                  </div>
                </div>
              </div>

              {/* LinkedIn Follow-up Sequence */}
              <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-[#0A66C2]/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-[#0A66C2] to-[#0A66C2]/80 p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                    <RiFlowChart size={24} />
              </div>
              <div>
                    <h2 className="text-lg font-semibold text-white">Voice Message Sequence</h2>
                    <p className="text-white/60 text-sm">Automated follow-up flow for voice messages</p>
              </div>
            </div>
            
                <div className="mt-6 relative">
                  <div className="flex flex-wrap justify-between items-center gap-4 px-4">
                    {/* Initial Voice Message */}
                    <div className="relative flex flex-col items-center w-40">
                      <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-4 border border-[#0A66C2]/20 relative group/node">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#0A66C2]/10 via-[#0A66C2]/5 to-[#0A66C2]/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                        <div className="flex flex-col items-center gap-2">
                          <FaMicrophone size={28} className="text-[#0A66C2]" />
                          <div className="text-white text-center font-medium">Initial Voice Message</div>
                          <div className="text-xs text-white/60 text-center">Day 0</div>
                </div>
                      </div>
                      <div className="h-8 w-1 bg-gradient-to-b from-[#0A66C2] to-[#0A66C2]/60 mt-2"></div>
              </div>
              
                    {/* Connection Status */}
                    <div className="relative flex flex-col items-center">
                      <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl py-3 px-4 border border-[#0A66C2]/20 relative group/node">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#0A66C2]/10 via-[#0A66C2]/5 to-[#0A66C2]/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                        <div className="text-white text-center text-sm font-medium">Connected?</div>
                      </div>
                      
                      <div className="flex gap-10 mt-2">
                        <div className="flex flex-col items-center">
                          <div className="h-6 w-1 bg-[#0A66C2]"></div>
                          <div className="text-[#0A66C2] text-xs">Yes</div>
                          <div className="h-6 w-1 bg-[#0A66C2]"></div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="h-6 w-1 bg-red-500"></div>
                          <div className="text-red-400 text-xs">No</div>
                          <div className="h-6 w-1 bg-red-500"></div>
                        </div>
                </div>
              </div>
              
                    {/* Follow-up Message */}
                    <div className="relative flex flex-col items-center w-40">
                      <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-4 border border-[#0A66C2]/20 relative group/node">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#0A66C2]/10 via-[#0A66C2]/5 to-[#0A66C2]/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                        <div className="flex flex-col items-center gap-2">
                          <FaMicrophone size={28} className="text-[#0A66C2]" />
                          <div className="text-white text-center font-medium">Follow-up Message</div>
                          <div className="text-xs text-white/60 text-center">Day 3</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom row outcomes */}
                  <div className="mt-12 flex justify-center gap-12">
                    <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-4 border border-[#0A66C2]/20 relative group/node">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#0A66C2]/10 via-[#0A66C2]/5 to-[#0A66C2]/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                      <div className="flex flex-col items-center gap-2">
                        <FaLinkedin size={24} className="text-[#0A66C2]" />
                        <div className="text-white text-center font-medium">Schedule Meeting</div>
                      </div>
                    </div>
                    
                    <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-4 border border-[#0A66C2]/20 relative group/node">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#0A66C2]/10 via-[#0A66C2]/5 to-[#0A66C2]/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                      <div className="flex flex-col items-center gap-2">
                        <FaMicrophone size={24} className="text-[#0A66C2]" />
                        <div className="text-white text-center font-medium">Final Voice Message</div>
                        <div className="text-xs text-white/60 text-center">Day 7</div>
                      </div>
                    </div>
                  </div>

                  {/* Stats about the sequence */}
                  <div className="mt-8 grid grid-cols-4 gap-4">
                    <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-lg p-3 border border-[#0A66C2]/10">
                      <div className="text-sm text-[#0A66C2] mb-1">Average Response Time</div>
                      <div className="text-lg text-white font-bold">2.5 days</div>
                    </div>
                    <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-lg p-3 border border-[#0A66C2]/10">
                      <div className="text-sm text-[#0A66C2] mb-1">Connection Rate</div>
                      <div className="text-lg text-white font-bold">45% accept</div>
                    </div>
                    <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-lg p-3 border border-[#0A66C2]/10">
                      <div className="text-sm text-[#0A66C2] mb-1">Meeting Rate</div>
                      <div className="text-lg text-white font-bold">18% book</div>
                    </div>
                    <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-lg p-3 border border-[#0A66C2]/10">
                      <div className="text-sm text-[#0A66C2] mb-1">Sequence Complete</div>
                      <div className="text-lg text-white font-bold">35% full flow</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* LinkedIn Contact Database Section */}
              <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-[#0A66C2]/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 mt-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-[#0A66C2] to-[#0A66C2]/80 p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                    <FaDatabase className="text-lg text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">LinkedIn Connections</h2>
                    <p className="text-white/60 text-sm">Professional contacts for voice message outreach</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <div className="bg-[#0A66C2]/20 px-3 py-1 rounded-full border border-[#0A66C2]/30 flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-[#0A66C2] animate-pulse"></div>
                      <span className="text-xs text-[#0A66C2] font-medium">Connection Required</span>
                    </div>
                    <div className="bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">
                      <span className="text-xs text-blue-400 font-medium">65% connection rate</span>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="table table-sm w-full">
                    <thead>
                      <tr className="border-b border-[#0A66C2]/20">
                        <th className="w-10 bg-[#28292b]/80 text-white/80">
                          <input type="checkbox" className="checkbox checkbox-xs checkbox-info" />
                        </th>
                        <th className="bg-[#28292b]/80 text-white/80">Name</th>
                        <th className="bg-[#28292b]/80 text-white/80">Company</th>
                        <th className="bg-[#28292b]/80 text-white/80">Position</th>
                        <th className="bg-[#28292b]/80 text-white/80">Location</th>
                        <th className="bg-[#28292b]/80 text-white/80 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-[#28292b]/40 border-b border-[#0A66C2]/10">
                        <td>
                          <input type="checkbox" className="checkbox checkbox-xs checkbox-info" checked />
                        </td>
                        <td className="font-medium text-white">{contacts[0].name}</td>
                        <td className="text-white/80">{contacts[0].company}</td>
                        <td className="text-white/80">{contacts[0].position}</td>
                        <td>{contacts[0].location}</td>
                        <td className="text-right">
                          <span className="text-[#0A66C2] text-sm">Connected</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#28292b]/40 border-b border-[#0A66C2]/10">
                        <td>
                          <input type="checkbox" className="checkbox checkbox-xs checkbox-info" />
                        </td>
                        <td className="font-medium text-white">{contacts[1].name}</td>
                        <td className="text-white/80">{contacts[1].company}</td>
                        <td className="text-white/80">{contacts[1].position}</td>
                        <td>{contacts[1].location}</td>
                        <td className="text-right">
                          <span className="text-blue-400 text-sm">Connection pending</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#28292b]/40 border-b border-[#0A66C2]/10">
                        <td>
                          <input type="checkbox" className="checkbox checkbox-xs checkbox-info" checked />
                        </td>
                        <td className="font-medium text-white">{contacts[5].name}</td>
                        <td className="text-white/80">{contacts[5].company}</td>
                        <td className="text-white/80">{contacts[5].position}</td>
                        <td>{contacts[5].location}</td>
                        <td className="text-right">
                          <span className="text-[#0A66C2] text-sm">Connected</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#28292b]/40 border-b border-[#0A66C2]/10">
                        <td>
                          <input type="checkbox" className="checkbox checkbox-xs checkbox-info" />
                        </td>
                        <td className="font-medium text-white">{contacts[6].name}</td>
                        <td className="text-white/80">{contacts[6].company}</td>
                        <td className="text-white/80">{contacts[6].position}</td>
                        <td>{contacts[6].location}</td>
                        <td className="text-right">
                          <span className="text-yellow-400 text-sm">Viewed profile</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#28292b]/40 border-b border-[#0A66C2]/10">
                        <td>
                          <input type="checkbox" className="checkbox checkbox-xs checkbox-info" />
                        </td>
                        <td className="font-medium text-white">{contacts[7].name}</td>
                        <td className="text-white/80">{contacts[7].company}</td>
                        <td className="text-white/80">{contacts[7].position}</td>
                        <td>{contacts[7].location}</td>
                        <td className="text-right">
                          <span className="text-red-400 text-sm">Not connected</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-white/60 text-sm">2 contacts selected from {contacts.length} total</div>
                  <div className="flex gap-2">
                    <div className="join">
                      <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-[#0A66C2]/20">«</button>
                      <button className="join-item btn btn-sm bg-[#0A66C2] text-white border-[#0A66C2]">1</button>
                      <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-[#0A66C2]/20">2</button>
                      <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-[#0A66C2]/20">3</button>
                      <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-[#0A66C2]/20">4</button>
                      <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-[#0A66C2]/20">5</button>
                      <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-[#0A66C2]/20">»</button>
                    </div>
                    <button className="btn btn-sm bg-gradient-to-br from-[#0A66C2] to-[#0A66C2]/80 hover:from-[#0A66C2]/90 hover:to-[#0A66C2]/70 text-white border-0 gap-2 shadow-lg hover:shadow-[#0A66C2]/20 transition-all">
                      Import Connections
                    </button>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-[#0A66C2]/10 border border-[#0A66C2]/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="text-[#0A66C2]">
                      <MdOutlineSettings className="text-xl animate-spin-slow" />
                    </div>
                    <div>
                      <p className="text-sm text-white/90">
                        <span className="font-medium text-[#0A66C2]">Connection requirement:</span> LinkedIn voice messages can only be sent to users who have accepted your connection request. Our system will automatically filter your selected contacts based on connection status.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* WhatsApp Content */}
          {activeTab === 'whatsapp' && (
            <>
              {/* WhatsApp Message Flow */}
              <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-[#25D366]/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-[#25D366] to-[#128C7E] p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                    <RiFlowChart size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">WhatsApp Message Flow</h2>
                    <p className="text-white/60 text-sm">Automated follow-up sequence for connected contacts</p>
                  </div>
                  <div className="ml-auto bg-[#25D366]/20 px-3 py-1 rounded-full border border-[#25D366]/30 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></div>
                    <span className="text-xs text-[#25D366] font-medium">Previous contact required</span>
                  </div>
                </div>

                <div className="p-4 bg-[#25D366]/10 border border-[#25D366]/20 rounded-lg mb-6">
                  <div className="flex items-center gap-2">
                    <div className="text-[#25D366]">
                      <FaWhatsapp size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-white/90">
                        <span className="font-medium text-[#25D366]">Important:</span> WhatsApp business messages can only be sent to contacts who have previously connected with your organization. This ensures compliance with WhatsApp's business messaging policies and maintains high engagement rates.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 relative">
                  {/* Flow diagram for WhatsApp sequence - keep this section */}
                  <div className="flex flex-wrap justify-between items-center gap-4 px-4">
                    {/* Initial Contact */}
                    <div className="relative flex flex-col items-center w-40">
                      <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-4 border border-[#25D366]/20 relative group/node hover:border-[#25D366]/40 cursor-pointer transition-all"
                           onClick={() => showModal('initial')}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#25D366]/10 via-[#128C7E]/5 to-[#25D366]/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                        <div className="flex flex-col items-center gap-2">
                          <FaWhatsapp size={28} className="text-[#25D366]" />
                          <div className="text-white text-center font-medium">Initial Contact</div>
                          <div className="text-xs text-white/60 text-center">Day 0</div>
                        </div>
                      </div>
                      <div className="h-8 w-1 bg-gradient-to-b from-[#25D366] to-[#128C7E] mt-2"></div>
                    </div>

                    {/* Response Check */}
                    <div className="relative flex flex-col items-center">
                      <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl py-3 px-4 border border-[#25D366]/20 relative group/node">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#25D366]/10 via-[#128C7E]/5 to-[#25D366]/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                        <div className="text-white text-center text-sm font-medium">Responded?</div>
                      </div>

                      {/* Yes/No paths */}
                      <div className="flex gap-10 mt-2">
                        <div className="flex flex-col items-center">
                          <div className="h-6 w-1 bg-[#25D366]"></div>
                          <div className="text-[#25D366] text-xs">Yes</div>
                          <div className="h-6 w-1 bg-[#25D366]"></div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="h-6 w-1 bg-red-500"></div>
                          <div className="text-red-400 text-xs">No</div>
                          <div className="h-6 w-1 bg-red-500"></div>
                        </div>
                      </div>
                    </div>

                    {/* Follow-up 1 */}
                    <div className="relative flex flex-col items-center w-40">
                      <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-4 border border-[#25D366]/20 relative group/node hover:border-[#25D366]/40 cursor-pointer transition-all"
                           onClick={() => showModal('followup1')}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#25D366]/10 via-[#128C7E]/5 to-[#25D366]/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                        <div className="flex flex-col items-center gap-2">
                          <FaWhatsapp size={28} className="text-[#25D366]" />
                          <div className="text-white text-center font-medium">Follow-up 1</div>
                          <div className="text-xs text-white/60 text-center">Day 3</div>
                        </div>
                      </div>
                      <div className="h-8 w-1 bg-gradient-to-b from-[#25D366] to-[#128C7E] mt-2"></div>
                    </div>

                    {/* Interest Check */}
                    <div className="relative flex flex-col items-center">
                      <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl py-3 px-4 border border-[#25D366]/20 relative group/node">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#25D366]/10 via-[#128C7E]/5 to-[#25D366]/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                        <div className="text-white text-center text-sm font-medium">Interested?</div>
                      </div>

                      {/* Yes/No paths */}
                      <div className="flex gap-10 mt-2">
                        <div className="flex flex-col items-center">
                          <div className="h-6 w-1 bg-[#25D366]"></div>
                          <div className="text-[#25D366] text-xs">Yes</div>
                          <div className="h-6 w-1 bg-[#25D366]"></div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="h-6 w-1 bg-red-500"></div>
                          <div className="text-red-400 text-xs">No</div>
                          <div className="h-6 w-1 bg-red-500"></div>
                        </div>
                      </div>
                    </div>

                    {/* Final Follow-up */}
                    <div className="relative flex flex-col items-center w-40">
                      <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-4 border border-[#25D366]/20 relative group/node hover:border-[#25D366]/40 cursor-pointer transition-all"
                           onClick={() => showModal('final')}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#25D366]/10 via-[#128C7E]/5 to-[#25D366]/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                        <div className="flex flex-col items-center gap-2">
                          <FaWhatsapp size={28} className="text-[#25D366]" />
                          <div className="text-white text-center font-medium">Final Message</div>
                          <div className="text-xs text-white/60 text-center">Day 7</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom row outcomes */}
                  <div className="mt-12 flex justify-center gap-12">
                    <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-4 border border-[#25D366]/20 relative group/node">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#25D366]/10 via-[#128C7E]/5 to-[#25D366]/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                      <div className="flex flex-col items-center gap-2">
                        <FaWhatsapp size={24} className="text-[#25D366]" />
                        <div className="text-white text-center font-medium">Schedule Meeting</div>
                      </div>
                    </div>

                    <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-xl p-4 border border-[#25D366]/20 relative group/node">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#25D366]/10 via-[#128C7E]/5 to-[#25D366]/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                      <div className="flex flex-col items-center gap-2">
                        <FaWhatsapp size={24} className="text-[#25D366]" />
                        <div className="text-white text-center font-medium">Archive Contact</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Preview Modal */}
              <dialog id="message-preview" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box bg-[#1e222b] border border-[#25D366]/15">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center">
                      <FaWhatsapp size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Message Preview</h3>
                      <p className="text-sm text-white/60">Personalized for {contacts[0].name}</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#1A1A1A] rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center flex-shrink-0">
                        <FaWhatsapp size={16} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white mb-1">{contacts[0].name}</div>
                        <div className="text-white/80">
                          {selectedMessage?.message.replace('[name]', contacts[0].name).replace('[company]', contacts[0].company)}
                        </div>
                        <div className="text-xs text-white/40 mt-2">12:45 PM</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button className="btn btn-sm bg-[#1e222b] text-white border border-[#25D366]/20">Close</button>
                    <button className="btn btn-sm bg-[#25D366] hover:bg-[#128C7E] text-white border-0">
                      Send Message
                    </button>
                  </div>
                </div>
              </dialog>

              {/* WhatsApp Contacts Database Section - ADDING NEW SECTION */}
              <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-[#25D366]/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 mt-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-[#25D366] to-[#128C7E] p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                    <FaDatabase className="text-lg text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">WhatsApp Contacts</h2>
                    <p className="text-white/60 text-sm">Contacts who have previously connected with your organization</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <div className="bg-[#25D366]/20 px-3 py-1 rounded-full border border-[#25D366]/30 flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></div>
                      <span className="text-xs text-[#25D366] font-medium">Pre-qualified Contacts</span>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="table table-sm w-full">
                    <thead>
                      <tr className="border-b border-[#25D366]/20">
                        <th className="w-10 bg-[#28292b]/80 text-white/80">
                          <input type="checkbox" className="checkbox checkbox-xs checkbox-success" />
                        </th>
                        <th className="bg-[#28292b]/80 text-white/80">Name</th>
                        <th className="bg-[#28292b]/80 text-white/80">Phone</th>
                        <th className="bg-[#28292b]/80 text-white/80">Company</th>
                        <th className="bg-[#28292b]/80 text-white/80">Position</th>
                        <th className="bg-[#28292b]/80 text-white/80 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-[#28292b]/40 border-b border-[#25D366]/10">
                        <td>
                          <input type="checkbox" className="checkbox checkbox-xs checkbox-success" checked />
                        </td>
                        <td className="font-medium text-white">{contacts[0].name}</td>
                        <td className="text-white/80">{contacts[0].phone}</td>
                        <td>{contacts[0].company}</td>
                        <td className="text-white/80">{contacts[0].position}</td>
                        <td className="text-right">
                          <span className="text-[#25D366] text-sm">Previously contacted</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#28292b]/40 border-b border-[#25D366]/10">
                        <td>
                          <input type="checkbox" className="checkbox checkbox-xs checkbox-success" />
                        </td>
                        <td className="font-medium text-white">{contacts[3].name}</td>
                        <td className="text-white/80">{contacts[3].phone}</td>
                        <td>{contacts[3].company}</td>
                        <td className="text-white/80">{contacts[3].position}</td>
                        <td className="text-right">
                          <span className="text-[#25D366] text-sm">Previously contacted</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#28292b]/40 border-b border-[#25D366]/10">
                        <td>
                          <input type="checkbox" className="checkbox checkbox-xs checkbox-success" checked />
                        </td>
                        <td className="font-medium text-white">{contacts[4].name}</td>
                        <td className="text-white/80">{contacts[4].phone}</td>
                        <td>{contacts[4].company}</td>
                        <td className="text-white/80">{contacts[4].position}</td>
                        <td className="text-right">
                          <span className="text-green-400 text-sm">Responded to email</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#28292b]/40 border-b border-[#25D366]/10">
                        <td>
                          <input type="checkbox" className="checkbox checkbox-xs checkbox-success" />
                        </td>
                        <td className="font-medium text-white">{contacts[7].name}</td>
                        <td className="text-white/80">{contacts[7].phone}</td>
                        <td>{contacts[7].company}</td>
                        <td className="text-white/80">{contacts[7].position}</td>
                        <td className="text-right">
                          <span className="text-yellow-400 text-sm">Scheduled meeting</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#28292b]/40 border-b border-[#25D366]/10">
                        <td>
                          <input type="checkbox" className="checkbox checkbox-xs checkbox-success" disabled />
                        </td>
                        <td className="font-medium text-white opacity-50">{contacts[2].name}</td>
                        <td className="text-white/80 opacity-50">{contacts[2].phone}</td>
                        <td className="opacity-50">{contacts[2].company}</td>
                        <td className="text-white/80 opacity-50">{contacts[2].position}</td>
                        <td className="text-right">
                          <span className="text-red-400 text-sm">No prior contact</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-white/60 text-sm">2 contacts selected from {contacts.length} total</div>
                  <div className="flex gap-2">
                    <div className="join">
                      <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-[#25D366]/20">«</button>
                      <button className="join-item btn btn-sm bg-[#25D366] text-white border-[#25D366]">1</button>
                      <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-[#25D366]/20">2</button>
                      <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-[#25D366]/20">3</button>
                      <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-[#25D366]/20">4</button>
                      <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-[#25D366]/20">5</button>
                      <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-[#25D366]/20">»</button>
                    </div>
                    <button className="btn btn-sm bg-gradient-to-br from-[#25D366] to-[#128C7E] hover:from-[#25D366]/90 hover:to-[#128C7E]/70 text-white border-0 gap-2 shadow-lg hover:shadow-[#25D366]/20 transition-all">
                      Sync WhatsApp
                    </button>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-[#25D366]/10 border border-[#25D366]/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="text-[#25D366]">
                      <MdOutlineRule className="text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-white/90">
                        <span className="font-medium text-[#25D366]">WhatsApp Business Policy:</span> Messages can only be sent to contacts who have previously interacted with your business. Contacts without prior interaction are automatically filtered out to maintain compliance with WhatsApp's business messaging guidelines.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailAutomation; 