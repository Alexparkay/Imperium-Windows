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
      id: 'independent_research',
      name: 'Independent Research',
      subject: 'Independent analysis on {{company}}\'s SAP migration potential',
      body: `Dear {{name}},

I hope this email finds you well. I noticed your presentation at the recent SAP User Group conference where you discussed {{company}}'s digital transformation challenges. Your insights about balancing legacy systems with innovation strategy were particularly compelling.

After connecting with some of our mutual colleagues in the SAP community, I conducted some independent research on your current SAP environment at {{location}} to evaluate potential cloud migration advantages.

Based on our analysis, with approximately 1,250 SAP users across your organization, a migration to SAP S/4HANA Cloud could reduce your annual operational costs by roughly $894,250, representing a 73.5% cost reduction. Our calculations indicate a 14-month payback period with a first-year ROI of approximately 65.2%.

I noticed your company is still running SAP ECC 6.0, which approaches end-of-support in 2027. Having helped other {{industry}} leaders with similar migration challenges, I'd be happy to share a more detailed analysis specific to your environment.

Would you be available for a brief conversation to discuss how these projections might align with your digital transformation roadmap?

Kind regards,
Your Name
SAP Migration Strategist`
    },
    {
      id: 'sap_intro',
      name: 'SAP Migration Introduction',
      subject: 'Reducing SAP TCO - Personalized Analysis for {{company}}',
      body: `Dear {{name}},

I recently read your LinkedIn article about {{company}}'s IT modernization initiatives and was particularly impressed by your strategic approach to digital transformation.

As you're likely aware, SAP ECC 6.0 mainstream support ends in 2027, creating an inflection point for many enterprises in the {{industry}} sector. After analyzing your current infrastructure based on public information, we've identified significant potential for operational savings through cloud migration.

Our preliminary assessment indicates:
• Potential annual savings of $894,250
• 73.5% reduction in operational costs
• 42 servers consolidated, 18 databases optimized
• 12,800 hours of annual maintenance time eliminated
• 14-month ROI breakeven point

With your teams at {{location}} already managing complex data environments, I believe our targeted migration approach could align perfectly with your stated goals of reducing technical debt while maintaining business continuity.

Would you be open to a 20-minute call next week to discuss a tailored migration strategy specifically for {{company}}?

Best regards,
Your Name
SAP Cloud Migration Specialist`
    },
    {
      id: 'sap_followup',
      name: 'SAP Migration Follow-up',
      subject: 'Following Up: S/4HANA Migration Strategy for {{company}}',
      body: `Dear {{name}},

I wanted to follow up on my previous email regarding the SAP S/4HANA Cloud migration potential we identified for {{company}}. I noticed your recent presentation at the Enterprise Cloud Summit where you mentioned challenges with your current SAP landscape maintenance costs.

Our analysis indicates that implementing S/4HANA Cloud at your {{location}} headquarters could deliver:
• Significant reduction in TCO (approximately $894,250 annually)
• Protection against SAP ECC end-of-support risks approaching in 2027
• 86% improvement in data processing efficiency
• $125,000 in potential cloud incentives available this fiscal year
• Implementation timeline of approximately 9 months

I've prepared a custom visualization showing your migration timeline and ROI projections based on your specific business processes and integration points. I'd be happy to share this detailed analysis with you. Would you have 15 minutes available this Thursday or Friday to review the findings?

Best regards,
Your Name
SAP S/4HANA Migration Consultant`
    },
    {
      id: 'sap_proposal',
      name: 'SAP Migration Proposal',
      subject: 'S/4HANA Cloud Migration Proposal for {{company}}',
      body: `Dear {{name}},

Thank you for your interest in exploring SAP S/4HANA Cloud migration options for {{company}}. As promised, I've attached our detailed migration proposal for your enterprise systems at {{location}}.

Based on the system landscape documentation you shared and our technical assessment, here are the key highlights:
• Annual Operational Savings: $894,250
• System User Count: 1,250 users
• Implementation Timeline: 9 months
• ROI Timeline: 14 months
• TCO Reduction: 73.5% over 5 years
• Environmental Impact: 185 tons CO2 reduction annually through server consolidation

The proposal includes a custom migration path that accounts for your critical customizations in the Finance and Supply Chain modules, as well as the third-party integrations you mentioned were essential to preserve. We've also included financial projections based on your current operational expenses and the specific RISE with SAP package that aligns with your business requirements.

I'm available to walk through the proposal with you and your technical team at your convenience.

Best regards,
Your Name
SAP Cloud Migration Strategist`
    }
  ];
  
  // Contact data - SAP/Cloud leadership contacts
  const contacts = [
    {
      id: 1,
      name: "Michael Chen",
      email: "m.chen@example.com",
      company: "Global Manufacturing Inc.",
      location: "Chicago, IL",
      position: "CIO"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "s.johnson@example.com",
      company: "Retail Innovations Group",
      location: "Minneapolis, MN",
      position: "VP of IT Infrastructure"
    },
    {
      id: 3,
      name: "David Rodriguez",
      email: "d.rodriguez@example.com",
      company: "Western Healthcare Systems",
      location: "Denver, CO",
      position: "Head of SAP Applications"
    },
    {
      id: 4,
      name: "Jennifer Lee",
      email: "j.lee@example.com",
      company: "Financial Services Corp",
      location: "Charlotte, NC",
      position: "Director of Cloud Strategy"
    },
    {
      id: 5,
      name: "Robert Patel",
      email: "r.patel@example.com",
      company: "Tech Solutions International",
      location: "Austin, TX",
      position: "SAP Program Director"
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
      const defaultTemplate = templates.find(t => t.id === 'independent_research');
      if (defaultTemplate) {
        setEmailSubject(defaultTemplate.subject);
        setEmailBody(defaultTemplate.body);
      }
      
      // Set default selected contacts
      setSelectedContacts([contacts[0].name, contacts[2].name]);
      
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
    <div className="min-h-screen bg-[#0A0A0A] text-white p-1">
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
                    <p className="text-white/60 text-sm">Automated follow-up sequence for prospects</p>
                  </div>
                </div>

                <div className="mt-6 relative">
                  {/* Flow diagram for WhatsApp sequence */}
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

                  {/* Stats about the sequence */}
                  <div className="mt-8 grid grid-cols-4 gap-4">
                    <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-lg p-3 border border-[#25D366]/10">
                      <div className="text-sm text-[#25D366] mb-1">Average Response Time</div>
                      <div className="text-lg text-white font-bold">4.2 hours</div>
                    </div>
                    <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-lg p-3 border border-[#25D366]/10">
                      <div className="text-sm text-[#25D366] mb-1">Response Rate</div>
                      <div className="text-lg text-white font-bold">68% reply</div>
                    </div>
                    <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-lg p-3 border border-[#25D366]/10">
                      <div className="text-sm text-[#25D366] mb-1">Meeting Rate</div>
                      <div className="text-lg text-white font-bold">32% book</div>
                    </div>
                    <div className="bg-[rgba(27,34,42,0.75)] backdrop-blur-md rounded-lg p-3 border border-[#25D366]/10">
                      <div className="text-sm text-[#25D366] mb-1">Sequence Complete</div>
                      <div className="text-lg text-white font-bold">85% of flow</div>
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

              {/* Campaign Performance */}
              <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-[#25D366]/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 mt-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-[#25D366] to-[#128C7E] p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                    <FaRegChartBar size={24} />
                </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Campaign Performance</h2>
                    <p className="text-white/60 text-sm">Real-time messaging statistics</p>
              </div>
            </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Message Templates */}
                  <div className="backdrop-blur-md bg-[#28292b]/40 rounded-lg p-4 border border-[#25D366]/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center">
                        <FaComments size={20} className="text-white" />
          </div>
                      <div>
                        <h3 className="text-white font-medium">Message Templates</h3>
                        <p className="text-white/60 text-sm">Pre-approved business templates</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {whatsappFlow.map(message => (
                        <div key={message.id} className="bg-[#1A1A1A] rounded-lg p-4">
                          <h4 className="text-[#25D366] font-medium mb-2">{message.name}</h4>
                          <p className="text-white/80 text-sm">{message.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Performance Chart */}
                  <div className="backdrop-blur-md bg-[#28292b]/40 rounded-lg p-4 border border-[#25D366]/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center">
                        <FaRegChartBar size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">Response Metrics</h3>
                        <p className="text-white/60 text-sm">Weekly engagement analysis</p>
                      </div>
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            { name: 'Mon', sent: 45, delivered: 45, read: 38, responded: 12 },
                            { name: 'Tue', sent: 52, delivered: 52, read: 45, responded: 18 },
                            { name: 'Wed', sent: 48, delivered: 48, read: 42, responded: 15 },
                            { name: 'Thu', sent: 55, delivered: 55, read: 48, responded: 20 },
                            { name: 'Fri', sent: 47, delivered: 47, read: 40, responded: 14 }
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis dataKey="name" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1e222b',
                              border: 'none',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Line type="monotone" dataKey="sent" stroke="#25D366" strokeWidth={2} dot={{ r: 4 }} />
                          <Line type="monotone" dataKey="delivered" stroke="#34D399" strokeWidth={2} dot={{ r: 4 }} />
                          <Line type="monotone" dataKey="read" stroke="#60A5FA" strokeWidth={2} dot={{ r: 4 }} />
                          <Line type="monotone" dataKey="responded" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
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