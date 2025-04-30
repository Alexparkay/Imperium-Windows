// import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
} from 'react-router-dom';
import Home from './pages/Home';
import Footer from './components/Footer';
import Menu from './components/menu/Menu';
import Error from './pages/Error';
import ToasterProvider from './components/ToasterProvider';
import Login from './pages/Login';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import FacilityDatabase from './pages/FacilityDatabase';
import FacilityEnrichment from './pages/FacilityEnrichment';
import EnergyUsageEstimation from './pages/EnergyUsageEstimation';
import SolarPanelPotential from './pages/SolarPanelPotential';
import EmailAutomation from './pages/EmailAutomation';
import OutreachTracking from './pages/OutreachTracking';
import Pricing from './pages/Pricing';

function App() {
  const Layout = () => {
    return (
      <div
        id="rootContainer"
        className="w-full p-0 m-0 overflow-visible min-h-screen flex flex-col justify-between"
      >
        <ToasterProvider />
        <ScrollRestoration />
        <div>
          <div className="w-full flex gap-0 mb-auto">
            <Menu />
            
            <div 
              className="w-full transition-all duration-300 ease-in-out ml-[110px] px-4 xl:px-6 2xl:px-8 py-4 overflow-clip"
            >
              <Outlet />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: '/profile',
          element: <Profile />,
        },
        {
          path: '/profile/edit',
          element: <EditProfile />,
        },
        {
          path: '/facility-database',
          element: <FacilityDatabase />,
        },
        {
          path: '/facility-data-scraper',
          element: <FacilityDatabase />,
        },
        {
          path: '/facility-enrichment',
          element: <FacilityEnrichment />,
        },
        {
          path: '/facility-enrichment/:facilityId',
          element: <FacilityEnrichment />,
        },
        {
          path: '/facility-ai-analysis',
          element: <FacilityEnrichment />,
        },
        {
          path: '/facility-ai-analysis/:facilityId',
          element: <FacilityEnrichment />,
        },
        {
          path: '/energy-usage-estimation',
          element: <EnergyUsageEstimation />,
        },
        {
          path: '/solar-panel-potential',
          element: <SolarPanelPotential />,
        },
        {
          path: '/email-automation',
          element: <EmailAutomation />,
        },
        {
          path: '/outreach-tracking',
          element: <OutreachTracking />,
        },
        {
          path: '/pricing',
          element: <Pricing />,
        },
      ],
      errorElement: <Error />,
    },
    {
      path: '/login',
      element: <Login />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
