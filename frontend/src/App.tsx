import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import MarketDatabase from './pages/MarketDatabase';
import SignalScanner from './pages/SignalScanner';
import DataEnrichment from './pages/DataEnrichment';
import MigrationInsights from './pages/MigrationInsights';
import Outreach from './pages/Outreach';
import OutreachTracking from './pages/OutreachTracking';
import Pricing from './pages/Pricing';
import Menu from './components/menu/Menu';
import { FilterProvider } from './contexts/FilterContext';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#020305]">
        <Menu />
        <main className="flex-1 ml-[110px]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/market-database" element={
              <FilterProvider>
                <MarketDatabase />
              </FilterProvider>
            } />
            <Route path="/signal-scanner" element={<SignalScanner />} />
            <Route path="/signal-scanner/:facilityId" element={<SignalScanner />} />
            <Route path="/data-enrichment" element={<DataEnrichment />} />
            <Route path="/migration-insights" element={<MigrationInsights />} />
            <Route path="/outreach" element={<Outreach />} />
            <Route path="/outreach-tracking" element={<OutreachTracking />} />
            <Route path="/pricing" element={<Pricing />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
