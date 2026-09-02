import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/ToastContainer';
import { CitizenSubmission } from './components/CitizenSubmission';
import { AIAnalysisView } from './components/AIAnalysisView';
import { ProjectCreationForm } from './components/ProjectCreationForm';
import { ProjectLifecycleView } from './components/ProjectLifecycleView';
import { LoginView } from './components/Auth/LoginView';
import { SignupView } from './components/Auth/SignupView';
import { CitizenDashboardView } from './components/Citizen/CitizenDashboardView';
import { CitizenTrackChallengeView } from './components/Citizen/CitizenTrackChallengeView';
import { CitizenChallengesList } from './components/Citizen/CitizenChallengesList';
import { CitizenProfile } from './components/Citizen/CitizenProfile';
import { CitizenSettings } from './components/Citizen/CitizenSettings';

// Admin Components
import { AdminDashboardView } from './components/Admin/AdminDashboardView';
import { AdminValidationView } from './components/Admin/AdminValidationView';
import { AdminUniversityAssignmentsView } from './components/Admin/AdminUniversityAssignmentsView';
import { AdminIndustryCollaborationsView } from './components/Admin/AdminIndustryCollaborationsView';
import { AdminAnalyticsView } from './components/Admin/AdminAnalyticsView';

// University & Industry Components
import { UniversityDashboardView } from './components/University/UniversityDashboardView';
import { IndustryDashboardView } from './components/Industry/IndustryDashboardView';

// Map Component
import { JharkhandMap } from './components/Map/JharkhandMap';

import type { PageView } from './context/AppContext';
import type { UserRole } from './types';

const MainContent: React.FC = () => {
  const { activePage, setActivePage, showToast } = useApp();
  const { isAuthenticated, profile } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const currentRole: UserRole = profile?.role || 'citizen';

  const allowedPagesByRole: Record<UserRole, PageView[]> = {
    citizen: [
      'citizen-dashboard', 
      'citizen-challenges', 
      'citizen-track', 
      'citizen-report', 
      'citizen-nearby', 
      'citizen-notifications', 
      'citizen-profile', 
      'citizen-settings', 
      'nearby-issues',
      'ai-analysis'
    ],
    university: [
      'university-dashboard', 
      'create-project', 
      'industry-dashboard', 
      'project-lifecycle', 
      'ai-analysis'
    ],
    industry: [
      'industry-dashboard', 
      'project-lifecycle', 
      'university-dashboard', 
      'ai-analysis'
    ],
    admin: [
      'admin-dashboard',
      'admin-challenges',
      'admin-pending',
      'admin-in-progress',
      'admin-resolved',
      'admin-overdue',
      'admin-universities',
      'admin-assignments',
      'admin-industry',
      'admin-map',
      'admin-analytics',
      'admin-reports',
      'admin-departments',
      'admin-staff',
      'admin-challenge-detail',
      'university-dashboard',
      'industry-dashboard',
      'project-lifecycle',
      'ai-analysis'
    ]
  };

  const defaultRoleDashboard: Record<UserRole, PageView> = {
    citizen: 'citizen-dashboard',
    university: 'university-dashboard',
    industry: 'industry-dashboard',
    admin: 'admin-dashboard'
  };

  // Route Protection Guard
  useEffect(() => {
    if (isAuthenticated && profile) {
      const allowed = allowedPagesByRole[currentRole];
      if (!allowed.includes(activePage)) {
        showToast('Access Restricted: You do not have permission to access this workspace.', 'error');
        setActivePage(defaultRoleDashboard[currentRole]);
      }
    }
  }, [isAuthenticated, profile, currentRole, activePage]);

  // Logged-out Screen -> Login / Signup Screen
  if (!isAuthenticated) {
    return (
      <main className="flex-1 bg-slate-50 min-h-screen flex items-center justify-center p-4">
        {authMode === 'login' ? (
          <LoginView onNavigateToSignup={() => setAuthMode('signup')} />
        ) : (
          <SignupView onNavigateToLogin={() => setAuthMode('login')} />
        )}
      </main>
    );
  }

  const renderView = () => {
    switch (activePage) {
      // Citizen Routes
      case 'citizen-dashboard':
        return <CitizenDashboardView />;
      case 'citizen-challenges':
        return <CitizenChallengesList />;
      case 'citizen-track':
        return <CitizenTrackChallengeView />;
      case 'citizen-report':
      case 'submit-challenge':
        return <CitizenSubmission />;
      case 'citizen-nearby':
      case 'nearby-issues':
        return <JharkhandMap />;
      case 'citizen-profile':
        return <CitizenProfile />;
      case 'citizen-settings':
        return <CitizenSettings />;
      
      // Admin Routes
      case 'admin-dashboard':
      case 'admin-challenges':
      case 'admin-in-progress':
      case 'admin-resolved':
      case 'admin-overdue':
        return <AdminDashboardView />;
      case 'admin-pending':
        return <AdminValidationView />;
      case 'admin-universities':
      case 'admin-assignments':
        return <AdminUniversityAssignmentsView />;
      case 'admin-industry':
        return <AdminIndustryCollaborationsView />;
      case 'admin-map':
      case 'admin-staff':
        return <JharkhandMap />;
      case 'admin-analytics':
      case 'admin-reports':
      case 'admin-departments':
        return <AdminAnalyticsView />;

      // University Workspace
      case 'university-dashboard':
        return <UniversityDashboardView />;
      case 'create-project':
        return <ProjectCreationForm />;

      // Industry Workspace
      case 'industry-dashboard':
        return <IndustryDashboardView />;

      // Lifecycle View
      case 'project-lifecycle':
        return <ProjectLifecycleView />;
      case 'ai-analysis':
        return <AIAnalysisView />;
      
      default:
        return currentRole === 'admin' ? <AdminDashboardView /> :
               currentRole === 'university' ? <UniversityDashboardView /> :
               currentRole === 'industry' ? <IndustryDashboardView /> :
               <CitizenDashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 font-sans text-slate-900">
      <Header />
      <div className="flex-1 flex w-full">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderView()}
        </main>
      </div>
      <ToastContainer />

      {/* Production Clean Footer */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 font-black text-white flex items-center justify-center text-xs">G</div>
            <span className="font-extrabold text-slate-200">YOUR GATI</span>
            <span>— Jharkhand State Innovation Ecosystem</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Smart India Hackathon 2026</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
