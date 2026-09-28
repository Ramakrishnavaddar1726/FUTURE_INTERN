import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { ToastProvider, useToast } from './context/ToastContext.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { Sidebar } from './components/Sidebar.js';
import { Header } from './components/Header.js';
import { LeadModal } from './components/LeadModal.js';
import { LeadDetailsDrawer } from './components/LeadDetailsDrawer.js';
import { Home } from './pages/Home.js';
import { Contact } from './pages/Contact.js';
import { Login } from './pages/Login.js';
import { Dashboard } from './pages/Dashboard.js';
import { Leads } from './pages/Leads.js';
import { FollowUps } from './pages/FollowUps.js';
import { Notes } from './pages/Notes.js';
import { Settings } from './pages/Settings.js';
import { api } from './services/api.js';
import { Lead } from './types/crm.js';

function MainApp() {
  const { isAuthenticated, isLoading } = useAuth();
  const { showToast } = useToast();

  // Page routing state
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [searchParam, setSearchParam] = useState<string>('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Global Lead Modal & Drawer state
  const [isGlobalAddLeadOpen, setIsGlobalAddLeadOpen] = useState(false);
  const [selectedLeadIdForDetails, setSelectedLeadIdForDetails] = useState<string | null>(null);

  // Listen to browser hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash) {
        if (hash === 'features' || hash === 'solutions' || hash === 'contact-form') {
          setCurrentPage('home');
          setTimeout(() => {
            const el = document.getElementById(hash);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 150);
        } else if (hash.startsWith('leads?search=')) {
          const q = decodeURIComponent(hash.replace('leads?search=', ''));
          setCurrentPage('leads');
          setSearchParam(q);
        } else {
          setCurrentPage(hash);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: string) => {
    if (page === 'features' || page === 'solutions' || page === 'contact-form') {
      setCurrentPage('home');
      window.location.hash = page;
      setTimeout(() => {
        const el = document.getElementById(page);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
      return;
    }

    if (page.startsWith('leads?search=')) {
      const q = decodeURIComponent(page.replace('leads?search=', ''));
      setSearchParam(q);
      setCurrentPage('leads');
      window.location.hash = page;
    } else {
      setSearchParam('');
      setCurrentPage(page);
      window.location.hash = page;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Guard for protected admin pages
  const isProtectedPage = ['dashboard', 'leads', 'followups', 'notes', 'settings'].includes(currentPage);

  useEffect(() => {
    if (!isLoading && isProtectedPage && !isAuthenticated) {
      showToast('Please sign in to access the CRM administration portal.', 'info');
      navigateTo('login');
    }
  }, [currentPage, isAuthenticated, isLoading]);

  // Global Lead Add Submit
  const handleGlobalAddLeadSubmit = async (leadData: Partial<Lead>): Promise<boolean> => {
    try {
      const res = await api.leads.create(leadData);
      if (res.success) {
        showToast('Lead created successfully!', 'success');
        return true;
      }
      return false;
    } catch (err) {
      showToast((err as Error).message || 'Failed to create lead', 'error');
      return false;
    }
  };

  // Determine top header title & subtitle
  const getHeaderInfo = () => {
    switch (currentPage) {
      case 'dashboard':
        return { title: 'CRM Dashboard', subtitle: 'Pipeline overview and conversion metrics' };
      case 'leads':
        return { title: 'Leads Management', subtitle: 'Database of all client inquiries and prospects' };
      case 'followups':
        return { title: 'Follow-ups Agenda', subtitle: 'Scheduled calls, proposals, and action items' };
      case 'notes':
        return { title: 'Client Notes Audit', subtitle: 'Chronological team communication history' };
      case 'settings':
        return { title: 'Settings', subtitle: 'Profile, security credentials, and database topology' };
      default:
        return { title: 'LeadPulse CRM', subtitle: 'Lead Management Platform' };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white gap-3">
        <span className="w-10 h-10 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
          Initializing LeadPulse CRM...
        </p>
      </div>
    );
  }

  // PUBLIC SITE LAYOUT (Home, Contact, Login)
  if (!isProtectedPage || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
        {currentPage !== 'login' && <Navbar onNavigate={navigateTo} currentPage={currentPage} />}

        <main className="flex-1">
          {(currentPage === 'home' || currentPage === 'features' || currentPage === 'solutions') && (
            <Home onNavigate={navigateTo} />
          )}
          {currentPage === 'contact' && <Contact onNavigate={navigateTo} />}
          {currentPage === 'login' && <Login onNavigate={navigateTo} />}
        </main>

        {currentPage !== 'login' && <Footer onNavigate={navigateTo} />}

        {/* Global Details Drawer if opened from anywhere */}
        <LeadDetailsDrawer
          leadId={selectedLeadIdForDetails}
          onClose={() => setSelectedLeadIdForDetails(null)}
          onLeadUpdated={() => {}}
          onEditLead={() => {}}
        />
      </div>
    );
  }

  // AUTHENTICATED CRM DASHBOARD LAYOUT
  const { title, subtitle } = getHeaderInfo();

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans antialiased text-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={navigateTo}
        onOpenAddLeadModal={() => setIsGlobalAddLeadOpen(true)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <Header
          title={title}
          subtitle={subtitle}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onNavigate={navigateTo}
          onSelectLeadById={(leadId) => setSelectedLeadIdForDetails(leadId)}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentPage === 'dashboard' && (
            <Dashboard
              onNavigate={navigateTo}
              onOpenAddLeadModal={() => setIsGlobalAddLeadOpen(true)}
              onViewLead={(lead) => setSelectedLeadIdForDetails(lead._id)}
            />
          )}

          {currentPage === 'leads' && (
            <Leads
              initialSearch={searchParam}
              selectedLeadId={selectedLeadIdForDetails}
              onClearSelectedLeadId={() => setSelectedLeadIdForDetails(null)}
            />
          )}

          {currentPage === 'followups' && (
            <FollowUps onViewLead={(leadId) => setSelectedLeadIdForDetails(leadId)} />
          )}

          {currentPage === 'notes' && (
            <Notes onViewLead={(leadId) => setSelectedLeadIdForDetails(leadId)} />
          )}

          {currentPage === 'settings' && <Settings />}
        </main>
      </div>

      {/* Global Add Lead Modal */}
      <LeadModal
        isOpen={isGlobalAddLeadOpen}
        onClose={() => setIsGlobalAddLeadOpen(false)}
        onSubmit={handleGlobalAddLeadSubmit}
        mode="add"
      />

      {/* Global Lead Details Drawer */}
      <LeadDetailsDrawer
        leadId={selectedLeadIdForDetails}
        onClose={() => setSelectedLeadIdForDetails(null)}
        onLeadUpdated={() => {}}
        onEditLead={() => {}}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ToastProvider>
  );
}
