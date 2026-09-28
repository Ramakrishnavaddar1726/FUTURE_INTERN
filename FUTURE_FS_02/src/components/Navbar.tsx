import React, { useState } from 'react';
import { Layers, ArrowRight, Menu, X, ShieldCheck, Zap, Sparkles, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const handleNavClick = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const handleScrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (currentPage !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    window.location.hash = sectionId;
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                LeadPulse<span className="text-indigo-600">.crm</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                Enterprise Pipeline
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-indigo-600 transition-colors cursor-pointer ${
                currentPage === 'home' ? 'text-indigo-600 font-bold' : ''
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => handleScrollToSection('features')}
              className="hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-500" />
              Platform Features
            </button>

            <button
              onClick={() => handleScrollToSection('solutions')}
              className="hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Solutions
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1 ${
                currentPage === 'contact' ? 'text-indigo-600 font-bold' : ''
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              Book Appointment
            </button>
          </div>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                Open CRM Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleNavClick('login')}
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Admin Login
                </button>
                <button
                  onClick={() => handleNavClick('contact')}
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 rounded-xl shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                >
                  Schedule Consultation <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2 shadow-lg">
          <button
            onClick={() => handleNavClick('home')}
            className="block w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Overview
          </button>
          <button
            onClick={() => handleScrollToSection('features')}
            className="block w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            ⚡ Platform Features
          </button>
          <button
            onClick={() => handleScrollToSection('solutions')}
            className="block w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            ✨ Industry Solutions
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="block w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-emerald-700 hover:bg-emerald-50 cursor-pointer"
          >
            📅 Book Appointment / Contact Form
          </button>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="w-full py-2.5 text-center text-xs font-bold text-white bg-indigo-600 rounded-xl shadow-xs cursor-pointer"
              >
                Open CRM Dashboard ({user?.name})
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleNavClick('login')}
                  className="w-full py-2.5 text-center text-xs font-bold text-slate-700 bg-slate-100 rounded-xl cursor-pointer"
                >
                  Admin Portal Login
                </button>
                <button
                  onClick={() => handleNavClick('contact')}
                  className="w-full py-2.5 text-center text-xs font-bold text-white bg-indigo-600 rounded-xl cursor-pointer"
                >
                  Book Consultation
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
