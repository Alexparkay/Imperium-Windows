import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdArrowForward, MdOutlineEmail, MdScheduleSend, MdSend, MdOutlinePersonAdd, MdOutlineSettings, MdOutlineRule } from 'react-icons/md';
import { FaRegCopy, FaRegEdit, FaRegSave, FaRegTrashAlt, FaRegLightbulb, FaDatabase, FaRegChartBar } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { RiFlowChart, RiMailSendLine, RiMailCheckLine, RiMailCloseLine, RiArrowRightLine, RiSplitCellsHorizontal } from 'react-icons/ri';

interface Facility {
  id: number;
  name: string;
  industry: string;
  location: string;
  manager: string;
  email: string;
  phone: string;
  analysis: {
    facilityType: string;
    squareFootage: number;
    energyRate: number;
    roofArea: number;
  };
  energyEstimation: {
    annualUsage: number;
    annualCost: number;
  };
  solarPotential: {
    calculated: boolean;
    maxPanels: number;
    annualProduction: number;
    installationCost: number;
    annualSavings: number;
    paybackPeriod: number;
    roi: number;
  };
  emailStatus: {
    drafted: boolean;
    sent: boolean;
    scheduled: boolean;
    scheduledDate?: Date;
  };
}

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
  
  // Email templates
  const templates = [
    {
      id: 'independent_research',
      name: 'Independent Research',
      subject: 'Independent research on {{company}}\'s energy savings',
      body: `Hey {{name}},

I came across your recent podcast interview on "Sustainable Business Leaders" where you discussed {{company}}'s commitment to reducing carbon footprint. Your insights about balancing operational efficiency with sustainability goals really resonated with me.

After listening, I was inspired to run some independent research on your facility at {{location}} to see if solar could be a game-changer for you.

Based on our calculations, your facility's estimated energy usage is around 250,000 kWh per year, with an approximate annual electricity cost of £80,000. If you were to install a 160 kW solar system, you could generate about 180% of your energy needs in-house and save approximately £50,000 per year. With available solar incentives, your return on investment would be just over 8 years.

I noticed your facility has that south-facing roof area that's actually perfect for panel placement. Would you be interested in seeing a visualization of how this could transform your energy profile?

Best,
Your Name`
    },
    {
      id: 'solar_intro',
      name: 'Solar Introduction',
      subject: 'Reduce Energy Costs with Solar - Personalized Analysis for {{company}}',
      body: `Dear {{name}},

I hope this email finds you well. I recently read your interview in Industry Today where you mentioned {{company}}'s sustainability initiatives, and I was particularly impressed by your commitment to reducing operational costs while maintaining environmental responsibility.

We've conducted an analysis of {{company}}'s facility at {{location}} and identified significant potential for solar energy savings.

Our analysis shows:
• Potential annual savings of $80,000
• 160 kW system capacity
• 620 solar panels
• 180% energy coverage

I noticed your recent facility expansion has created even more roof space that could be leveraged for solar installation. Would you be available for a 15-minute call next week to discuss how these savings could specifically benefit {{company}}'s operations in the {{location}} area?

Best regards,
Your Name
Solar Energy Consultant`
    },
    {
      id: 'solar_followup',
      name: 'Solar Follow-up',
      subject: 'Following Up: Solar Energy Savings for {{company}}',
      body: `Dear {{name}},

I wanted to follow up on my previous email regarding the solar energy potential we identified for {{company}}'s facility. I noticed your recent LinkedIn post about reducing operational costs and thought this might align perfectly with your current priorities.

Our analysis indicates that implementing solar energy at your {{location}} facility could result in:
• Significant reduction in energy costs (approximately $80,000 annually)
• Protection against rising utility rates in the {{location}} region
• Enhanced sustainability profile, supporting your public commitment to reduce carbon emissions
• Potential tax incentives specific to your industry and location

I've also prepared a custom visualization showing how the installation would look on your specific building. I'd be happy to share this detailed analysis with you. Would you have time for a brief call this Thursday or Friday?

Best regards,
Your Name
Solar Energy Consultant`
    },
    {
      id: 'solar_proposal',
      name: 'Solar Proposal',
      subject: 'Solar Energy Proposal for {{company}}',
      body: `Dear {{name}},

Thank you for your interest in exploring solar energy solutions for {{company}}. As promised, I've attached our detailed proposal for your facility at {{location}}.

Based on the architectural plans you shared and our site assessment, here are the key highlights of our proposal:
• System Size: 160 kW
• Annual Production: 250,000 kWh
• Annual Savings: $80,000
• ROI Timeline: Just over 8 years
• Environmental Impact: Reduction of 180 tons of CO2 annually

The proposal includes the custom design that accounts for your facility's unique roof structure and that skylight area you mentioned was important to preserve. We've also included financial projections based on your current energy consumption patterns and the specific utility rates in your area.

Please review the attached proposal at your convenience. I'm available to answer any questions you might have or to schedule a site visit.

Best regards,
Your Name
Solar Energy Consultant`
    }
  ];
  
  // Contact data
  const contacts = [
    {
      id: 1,
      name: "Jeff Levy",
      email: "j.levy@example.com",
      company: "Apple",
      location: "Atlanta, GA",
      position: "Facilities Manager"
    },
    {
      id: 2,
      name: "Amy Huke",
      email: "a.huke@example.com",
      company: "Honeywell",
      location: "Kansas City, MO",
      position: "Facilities Manager"
    },
    {
      id: 3,
      name: "Ryan Kuddes",
      email: "r.kuddes@example.com",
      company: "Apple",
      location: "Denver, CO",
      position: "Facilities Manager"
    },
    {
      id: 4,
      name: "Zuretti Carter",
      email: "z.carter@example.com",
      company: "ChargePoint",
      location: "San Francisco, CA",
      position: "Facilities Manager"
    },
    {
      id: 5,
      name: "Scott Simpson",
      email: "s.simpson@example.com",
      company: "Plexus Corp.",
      location: "Neenah, WI",
      position: "Facilities Manager"
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020305] flex items-center justify-center relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="fixed top-20 right-40 w-96 h-96 bg-gradient-to-br from-orange-500/5 to-transparent rounded-full blur-3xl transform rotate-12 opacity-70 pointer-events-none"></div>
        <div className="fixed bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-orange-500/5 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-60 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="loading loading-spinner loading-lg text-orange-500 relative"></div>
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
    <div className="w-full px-1 py-2 bg-[#020305] min-h-screen min-w-full relative">
      {/* Background gradient orbs */}
      <div className="fixed top-20 right-40 w-96 h-96 bg-gradient-to-br from-orange-500/5 to-transparent rounded-full blur-3xl transform rotate-12 opacity-70 pointer-events-none"></div>
      <div className="fixed bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-orange-500/5 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-60 pointer-events-none"></div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Simple Header */}
          <div className="pt-4 pb-8">
            <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
              Email Automation
            </h1>
            <p className="text-white/60 mt-2">Create targeted campaigns with data-driven templates</p>
          </div>

          {/* Main content area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Email Templates */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              {/* Email Templates */}
              <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-emerald-500/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-emerald-500 to-amber-600 p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                    <MdOutlineEmail size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Email Templates</h2>
                    <p className="text-white/60 text-sm">Choose a high-converting starter</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex flex-col gap-3">
                    {templates.map(template => (
                      <div 
                        key={template.id}
                        className={`backdrop-blur-md bg-[#28292b]/40 rounded-lg p-3 border border-emerald-500/10 cursor-pointer hover:border-emerald-500/30 transition-all duration-300 ${
                          selectedTemplate === template.id 
                            ? 'ring-1 ring-emerald-500 shadow-lg shadow-emerald-500/10' 
                            : ''
                        }`}
                        onClick={() => handleTemplateChange(template.id)}
                      >
                        <div className="flex justify-between">
                          <h3 className="font-medium text-white">{template.name}</h3>
                          {template.id === 'solar_intro' && (
                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full inline-flex items-center gap-1">
                              <FaRegLightbulb size={10} />
                              <span>38% open rate</span>
                            </span>
                          )}
                          {template.id === 'solar_followup' && (
                            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full inline-flex items-center gap-1">
                              <FaRegLightbulb size={10} />
                              <span>27% reply rate</span>
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-white/60 truncate">{template.subject}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <button className="btn btn-sm bg-gradient-to-br from-emerald-500 to-amber-600 hover:from-emerald-600 hover:to-amber-700 text-white border-0 gap-2 shadow-lg hover:shadow-emerald-500/20 transition-all">
                      <FaRegEdit size={16} />
                      Create New Template
                    </button>
                  </div>
                </div>
              </div>

              {/* Automation Settings (Collapsible) */}
              <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-emerald-500/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300">
                <details className="w-full">
                  <summary className="flex items-center gap-3 cursor-pointer mb-4">
                    <div className="bg-gradient-to-br from-emerald-500 to-amber-600 p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                      <MdOutlineSettings size={24} />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">Automation Settings</h2>
                      <p className="text-white/60 text-sm">Optimize your outreach workflow</p>
                    </div>
                  </summary>
                  
                  <div className="mt-6 space-y-4 pl-12">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium text-white/80">Follow-up Timing</span>
                        <span className="label-text-alt text-green-400 flex items-center gap-1 text-xs">
                          <FaRegLightbulb size={10} />
                          5 days optimal
                        </span>
                      </label>
                      <select className="select w-full backdrop-blur-md bg-[#28292b]/60 border border-emerald-500/20 text-white focus:border-emerald-500">
                        <option value="3">After 3 days</option>
                        <option value="5" selected>After 5 days</option>
                        <option value="7">After 7 days</option>
                        <option value="14">After 14 days</option>
                      </select>
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium text-white/80">Maximum Follow-ups</span>
                        <span className="label-text-alt text-green-400 flex items-center gap-1 text-xs">
                          <FaRegLightbulb size={10} />
                          2 follow-ups +18% response
                        </span>
                      </label>
                      <select className="select w-full backdrop-blur-md bg-[#28292b]/60 border border-emerald-500/20 text-white focus:border-emerald-500">
                        <option value="1">1 follow-up</option>
                        <option value="2" selected>2 follow-ups</option>
                        <option value="3">3 follow-ups</option>
                      </select>
                    </div>
                    
                    <div className="form-control">
                      <label className="flex items-center gap-2 cursor-pointer group/checkbox">
                        <input type="checkbox" className="checkbox checkbox-warning" defaultChecked />
                        <span className="label-text text-white/80">Stop sequence if reply received</span>
                      </label>
                    </div>
                    
                    <div className="form-control">
                      <label className="flex items-center gap-2 cursor-pointer group/checkbox">
                        <input type="checkbox" className="checkbox checkbox-warning" defaultChecked />
                        <span className="label-text text-white/80">Track email opens and clicks</span>
                      </label>
                    </div>
                  </div>
                </details>
              </div>

              {/* Delivery Rules (Collapsible) */}
              <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-emerald-500/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300">
                <details className="w-full">
                  <summary className="flex items-center gap-3 cursor-pointer mb-4">
                    <div className="bg-gradient-to-br from-emerald-500 to-amber-600 p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                      <MdOutlineRule size={24} />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">Delivery Rules</h2>
                      <p className="text-white/60 text-sm">Maximize engagement with timing</p>
                    </div>
                  </summary>
                  
                  <div className="mt-6 space-y-4 pl-12">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium text-white/80">Delivery Window</span>
                        <span className="label-text-alt text-green-400 flex items-center gap-1 text-xs">
                          <FaRegLightbulb size={10} />
                          9-11am highest open rates
                        </span>
                      </label>
                      <div className="flex gap-4">
                        <input 
                          type="time" 
                          className="input flex-1 backdrop-blur-md bg-[#28292b]/60 border border-emerald-500/20 text-white focus:border-emerald-500"
                          defaultValue="09:00"
                        />
                        <input 
                          type="time" 
                          className="input flex-1 backdrop-blur-md bg-[#28292b]/60 border border-emerald-500/20 text-white focus:border-emerald-500"
                          defaultValue="17:00"
                        />
                      </div>
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium text-white/80">Time Zone</span>
                      </label>
                      <select className="select w-full backdrop-blur-md bg-[#28292b]/60 border border-emerald-500/20 text-white focus:border-emerald-500">
                        <option selected>Recipient's Local Time</option>
                        <option>Your Local Time</option>
                        <option>UTC</option>
                      </select>
                    </div>
                    
                    <div className="form-control">
                      <label className="flex items-center gap-2 cursor-pointer group/checkbox">
                        <input type="checkbox" className="checkbox checkbox-warning" defaultChecked />
                        <span className="label-text text-white/80">Respect business hours only</span>
                      </label>
                    </div>
                    
                    <div className="form-control">
                      <label className="flex items-center gap-2 cursor-pointer group/checkbox">
                        <input type="checkbox" className="checkbox checkbox-warning" defaultChecked />
                        <span className="label-text text-white/80">Skip weekends</span>
                      </label>
                    </div>
                  </div>
                </details>
              </div>
            </div>

            {/* Right Column - Email Editor and Preview Side-by-Side */}
            <div className="lg:col-span-2">
              <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-emerald-500/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email Editor */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-gradient-to-br from-emerald-500 to-amber-600 p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
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
                        <button className="btn btn-sm bg-gradient-to-br from-emerald-500 to-amber-600 hover:from-emerald-600 hover:to-amber-700 text-white border-0 gap-2 shadow-lg hover:shadow-emerald-500/20 transition-all">
                          <FaRegSave size={16} />
                          Save as Template
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Email Preview */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-gradient-to-br from-emerald-500 to-amber-600 p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
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
            </div>
          </div>

          {/* Email Sequencing Visualization */}
          <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-emerald-500/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-emerald-500 to-amber-600 p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
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
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-amber-500/5 to-emerald-600/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
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
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-amber-500/5 to-emerald-600/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
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
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-amber-500/5 to-emerald-600/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
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
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-amber-500/5 to-emerald-600/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
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
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-amber-500/5 to-emerald-600/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
                    <div className="flex flex-col items-center gap-2">
                      <RiMailCloseLine size={28} className="text-emerald-400" />
                      <div className="text-white text-center font-medium">Follow-up Email 2</div>
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
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-amber-500/5 to-emerald-600/10 opacity-25 group-hover/node:opacity-40 transition-opacity rounded-xl"></div>
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
                    <polygon points="0 0, 10 3.5, 0 7" fill="#F97316" />
                  </marker>
                </defs>
                {/* Lines would be drawn here in a real implementation */}
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

          {/* Contact Database Visualization */}
          <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-emerald-500/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-emerald-500 to-amber-600 p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                <FaDatabase size={24} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Contact Database</h2>
                <p className="text-white/60 text-sm">Select your audience from 2,347 verified contacts</p>
              </div>
              <div className="ml-auto">
                <span className="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-3 py-2 gap-1">
                  <FaRegChartBar className="text-xs" />
                  42% avg. open rate
                </span>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex flex-col gap-2">
                {contacts.map(contact => (
                  <div 
                    key={contact.id}
                    className="flex items-center gap-3 p-3 rounded-lg backdrop-blur-sm bg-[#28292b]/30 border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 group/contact"
                  >
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="checkbox checkbox-warning"
                        checked={selectedContacts.includes(contact.name)}
                        onChange={() => handleContactToggle(contact.name)}
                      />
                      <div className="absolute inset-0 bg-emerald-500/20 rounded-lg filter blur-lg opacity-0 group-hover/contact:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="transform group-hover/contact:translate-x-1 transition-transform duration-300 flex-1">
                      <div className="font-medium text-white">{contact.name}</div>
                      <div className="text-sm text-white/80">{contact.email}</div>
                      <div className="text-xs text-white/60">{contact.company} - {contact.position}</div>
                    </div>
                    <div className="text-white/60 text-sm">
                      {contact.id === 1 && <span className="text-green-400">Opened previous email</span>}
                      {contact.id === 2 && <span className="text-blue-400">New contact</span>}
                      {contact.id === 4 && <span className="text-yellow-400">Clicked link</span>}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              <div className="flex justify-between items-center mt-6">
                <span className="text-sm text-white/60">
                  {selectedContacts.length} contacts selected from 2,347 total
                </span>
                <div className="flex items-center gap-1">
                  <button className="btn btn-sm btn-circle bg-transparent hover:bg-emerald-500/10 border border-emerald-500/30 text-white">«</button>
                  {[...Array(5)].map((_, i) => (
                    <button 
                      key={i} 
                      className={`btn btn-sm btn-circle ${i + 1 === currentPage ? 'bg-emerald-500 text-white' : 'bg-transparent hover:bg-emerald-500/10 border border-emerald-500/30 text-white'}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <span className="px-1 text-white/60">...</span>
                  <button className="btn btn-sm btn-circle bg-transparent hover:bg-emerald-500/10 border border-emerald-500/30 text-white">{totalPages}</button>
                  <button className="btn btn-sm btn-circle bg-transparent hover:bg-emerald-500/10 border border-emerald-500/30 text-white">»</button>
                </div>
                <button className="btn btn-sm bg-gradient-to-br from-emerald-500 to-amber-600 hover:from-emerald-600 hover:to-amber-700 text-white border-0 gap-2 shadow-lg hover:shadow-emerald-500/20 transition-all">
                  Import Contacts
                </button>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-emerald-500/15 p-6 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-emerald-500 to-amber-600 p-4 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                <MdScheduleSend size={24} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Schedule Delivery</h2>
                <p className="text-white/60 text-sm">Optimize timing for maximum engagement</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-white/80">Date</span>
                  <span className="label-text-alt text-green-400 flex items-center gap-1 text-xs">
                    <FaRegLightbulb size={10} />
                    <span>Tuesday-Thursday optimal</span>
                  </span>
                </label>
                <div className="relative group/input">
                  <input 
                    type="date" 
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="input w-full backdrop-blur-md bg-[#28292b]/60 border border-emerald-500/20 text-white focus:border-emerald-500 pr-10"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover/input:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-white/80">Time</span>
                  <span className="label-text-alt text-green-400 flex items-center gap-1 text-xs">
                    <FaRegLightbulb size={10} />
                    <span>10:30am highest CTR</span>
                  </span>
                </label>
                <div className="relative group/input">
                  <input 
                    type="time" 
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="input w-full backdrop-blur-md bg-[#28292b]/60 border border-emerald-500/20 text-white focus:border-emerald-500 pr-10"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover/input:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              
              <div className="form-control flex flex-col justify-end">
                <button 
                  onClick={handleSendEmails}
                  className="btn w-full bg-gradient-to-br from-emerald-500 to-amber-600 hover:from-emerald-600 hover:to-amber-700 text-white border-0 gap-2 shadow-lg hover:shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed group/button relative overflow-hidden h-[42px]"
                  disabled={selectedContacts.length === 0}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-200%] group-hover/button:translate-x-[200%] transition-transform duration-1000"></div>
                  <MdSend size={18} className="transform group-hover/button:rotate-12 transition-transform duration-300" />
                  {selectedContacts.length > 0 
                    ? `Schedule ${selectedContacts.length} Emails` 
                    : 'Select Recipients First'}
                </button>
                
                <div className="text-center mt-2">
                  <label className="flex items-center justify-center gap-2 cursor-pointer group/checkbox text-sm">
                    <input type="checkbox" className="checkbox checkbox-xs checkbox-warning" defaultChecked />
                    <span className="text-white/80 group-hover/checkbox:text-emerald-500 transition-colors duration-300">
                      Send follow-up if no response after 5 days
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailAutomation; 