import React, { useState } from 'react';
import GlassPanel from '../components/GlassPanel';
import GlassButton from '../components/GlassButton';
import GlassCard from '../components/GlassCard';
import GlassTable from '../components/GlassTable';
import { MdPeopleAlt, MdBarChart, MdBusiness, MdOutlineAnalytics, MdSearch, MdFilterList, MdAdd, MdSettings, MdClose } from 'react-icons/md';
import { motion } from 'framer-motion';

const GlassmorphicExample = () => {
  const [selectedTab, setSelectedTab] = useState('dashboard');
  
  // Sample data for cards
  const cardData = [
    { title: 'Total Contacts', value: '426K', icon: <MdPeopleAlt />, change: { value: '+15%', positive: true } },
    { title: 'High Potential', value: '1,965', icon: <MdBusiness />, change: { value: '+5.2%', positive: true } },
    { title: 'Enriched', value: '0', icon: <MdOutlineAnalytics />, change: { value: '0%', positive: false } },
    { title: 'Success Rate', value: '67%', icon: <MdBarChart />, change: { value: '+2.8%', positive: true } },
  ];
  
  // Sample data for table
  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Job Title', accessor: 'jobTitle' },
    { header: 'Company', accessor: 'company' },
    { header: 'Location', accessor: 'location' },
  ];
  
  const tableData = [
    { 
      id: 1, 
      name: 'Michael Schmitt', 
      jobTitle: 'Head of IT Client Enablement', 
      company: 'SAP', 
      location: 'Memphis, Tennessee' 
    },
    { 
      id: 2, 
      name: 'Kyle Flynn-Kasaba', 
      jobTitle: 'Head of IT Infrastructure', 
      company: 'Wood', 
      location: 'Houston, Texas' 
    },
    { 
      id: 3, 
      name: 'Wells Shammout', 
      jobTitle: 'VP, Head of IT', 
      company: 'IPS', 
      location: 'Rutherford, New Jersey' 
    },
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20
      }
    }
  };
  
  return (
    <div className="p-8 relative min-h-screen">
      <motion.div 
        className="mb-8 flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-semibold">Glassmorphic UI</h1>
        
        <div className="flex gap-4">
          <GlassButton icon={<MdSearch />} secondary>
            Search
          </GlassButton>
          <GlassButton icon={<MdFilterList />} outlined>
            Filters
          </GlassButton>
          <GlassButton icon={<MdAdd />} primary>
            New Contact
          </GlassButton>
        </div>
      </motion.div>
      
      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
        {['dashboard', 'contacts', 'analytics', 'settings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-5 py-2.5 rounded-lg transition-all duration-300 ${
              selectedTab === tab 
                ? 'bg-accent-primary text-white' 
                : 'bg-background-accent/50 text-text-secondary hover:text-text-primary hover:bg-background-accent'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {cardData.map((card, index) => (
          <motion.div key={index} variants={itemVariants}>
            <GlassCard
              title={card.title}
              value={card.value}
              icon={card.icon}
              change={card.change}
            />
          </motion.div>
        ))}
      </motion.div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <GlassPanel>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Contact Database</h2>
              <div className="flex gap-2">
                <GlassButton icon={<MdFilterList />} secondary>
                  Filter
                </GlassButton>
                <GlassButton icon={<MdSettings />}>
                  Settings
                </GlassButton>
              </div>
            </div>
            
            <GlassTable
              columns={columns}
              data={tableData}
              hoverable
            />
            
            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <span className="text-text-secondary text-sm">Showing 1-3 of 426,000 contacts</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded border border-white/10 text-text-secondary">
                  Previous
                </button>
                <button className="px-3 py-1 rounded bg-accent-primary text-white">
                  1
                </button>
                <button className="px-3 py-1 rounded border border-white/10 text-text-secondary">
                  2
                </button>
                <button className="px-3 py-1 rounded border border-white/10 text-text-secondary">
                  3
                </button>
                <button className="px-3 py-1 rounded border border-white/10 text-text-secondary">
                  Next
                </button>
              </div>
            </div>
          </GlassPanel>
        </motion.div>
        
        {/* Right Side */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <GlassPanel>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Quick Actions</h2>
              <button className="text-text-secondary hover:text-text-primary">
                <MdClose />
              </button>
            </div>
            
            <div className="space-y-4">
              <button className="w-full p-4 rounded-lg transition-all duration-300 bg-background-accent/30 hover:bg-accent-primary/10 text-left border border-white/5 hover:border-accent-primary/30">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-lg bg-accent-primary/20 flex items-center justify-center mr-3">
                    <MdSearch className="text-accent-primary" />
                  </div>
                  <h3 className="font-medium">Search Signals</h3>
                </div>
                <p className="text-text-secondary text-sm">
                  Find potential customers and opportunities
                </p>
              </button>
              
              <button className="w-full p-4 rounded-lg transition-all duration-300 bg-background-accent/30 hover:bg-accent-primary/10 text-left border border-white/5 hover:border-accent-primary/30">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-lg bg-accent-primary/20 flex items-center justify-center mr-3">
                    <MdOutlineAnalytics className="text-accent-primary" />
                  </div>
                  <h3 className="font-medium">View Analytics</h3>
                </div>
                <p className="text-text-secondary text-sm">
                  Check performance and insights
                </p>
              </button>
              
              <button className="w-full p-4 rounded-lg transition-all duration-300 bg-background-accent/30 hover:bg-accent-primary/10 text-left border border-white/5 hover:border-accent-primary/30">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-lg bg-accent-primary/20 flex items-center justify-center mr-3">
                    <MdPeopleAlt className="text-accent-primary" />
                  </div>
                  <h3 className="font-medium">Saved Lists</h3>
                </div>
                <p className="text-text-secondary text-sm">
                  View your saved contact lists
                </p>
              </button>
            </div>
            
            <div className="mt-6 p-4 rounded-lg bg-accent-primary/10 border border-accent-primary/30">
              <h3 className="font-medium mb-2 flex items-center">
                <MdBusiness className="mr-2" /> Profile Settings
              </h3>
              <p className="text-text-secondary text-sm mb-4">
                Based on the selections for your company profile, we have tailored everything towards your ideal customer profile.
              </p>
              <GlassButton primary fullWidth>
                Update Profile
              </GlassButton>
            </div>
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  );
};

export default GlassmorphicExample; 