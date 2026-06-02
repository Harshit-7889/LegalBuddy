import React from 'react';
import { useAuth } from '../context/AuthContext';

// Import all the view components
import NavBar from './NavBar';
import Footer from './Footer';
import Hero from './Hero';
import RoleSummary from './RoleSummary';
import FeaturesGrid from './FeaturesGrid';
import TrustSection from './TrustSection';
import UploadCTA from './UploadCTA';
import TemplatesPreview from './TemplatesPreview';
import HowItWorks from './HowItWorks';
import ChatAccess from './ChatAccess';

// Import the new dashboard components
import UserDashboard from './UserDashboard';
import LawyerDashboard from './LawyerDashboard';
import AdminDashboard from './AdminDashboard';

const HomePage = ({ role, quota, showVerifiedBadge, showAdminWidget }) => {
  const { user } = useAuth();

  const renderContent = () => {
    if (!user) {
      // GUEST VIEW (The original homepage content)
      return (
        <>
          <Hero role={role} />
          <RoleSummary />
          <FeaturesGrid />
          <TrustSection />
          <UploadCTA role={role} quota={quota} />
          <TemplatesPreview role={role} showVerifiedBadge={showVerifiedBadge} />
          <HowItWorks />
        </>
      );
    }

    // LOGGED-IN VIEWS
    switch (user.role) {
      case 'user':
        return <UserDashboard user={user} quota={quota} />;
      case 'lawyer':
        return <LawyerDashboard user={user} quota={quota} />;
      case 'admin':
        return <AdminDashboard user={user} />;
      default:
        // Fallback for any other case
        return <UserDashboard user={user} quota={quota} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar 
        role={role} 
        quota={quota} 
        showVerifiedBadge={showVerifiedBadge}
        showAdminWidget={showAdminWidget}
      />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default HomePage
