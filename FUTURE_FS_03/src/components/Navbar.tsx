import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Calendar, Briefcase } from 'lucide-react';

interface NavbarProps {
  onOpenPitch: () => void;
  onBookNow: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPitch, onBookNow }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Treatments', href: '#treatments' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#FAF9F6]/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs py-3.5'
          : 'bg-[#FAF9F6]/80 backdrop-blur-xs border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="font-serif text-2xl sm:text-2xl font-semibold tracking-tight text-stone-900 hover:text-amber-900 transition-colors whitespace-nowrap"
        >
          Veda Aesthetic Clinic
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-600" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className="hover:text-stone-950 transition-colors hover:underline underline-offset-4 decoration-stone-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Agency Pitch presentation button */}
          <button
            onClick={onOpenPitch}
            type="button"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors border border-stone-200 whitespace-nowrap"
            title="View Agency Client Pitch Presentation"
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-800" />
            <span>Client Pitch</span>
          </button>

          {/* Quick Call */}
          <a
            href="tel:+919845012845"
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-lg transition-colors whitespace-nowrap"
          >
            <Phone className="w-3.5 h-3.5 text-stone-500" />
            <span>080-4501-2845</span>
          </a>

          {/* Primary CTA */}
          <button
            onClick={onBookNow}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 active:scale-[0.98] rounded-lg transition-all shadow-xs whitespace-nowrap"
          >
            <Calendar className="w-4 h-4 text-amber-300" />
            <span>Book Consultation</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="lg:hidden p-2 text-stone-600 hover:text-stone-900 focus:outline-hidden"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF9F6] border-b border-stone-200 px-6 py-6 space-y-4 animate-in fade-in duration-200">
          <nav className="flex flex-col space-y-3" aria-label="Mobile Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-base font-medium text-stone-700 hover:text-stone-950 py-1 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-4 border-t border-stone-200/80 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPitch();
              }}
              type="button"
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-stone-700 bg-stone-100 rounded-lg border border-stone-200"
            >
              <Briefcase className="w-4 h-4 text-amber-800" />
              <span>Agency Client Pitch Deck</span>
            </button>
            <a
              href="tel:+919845012845"
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-stone-800 bg-amber-50/60 rounded-lg border border-amber-200/60"
            >
              <Phone className="w-4 h-4 text-stone-700" />
              <span>Call Clinic: +91 98450 12845</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
