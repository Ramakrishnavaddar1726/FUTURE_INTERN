import React, { useState, useEffect } from 'react';
import { MessageSquare, Phone, Calendar, ArrowUp } from 'lucide-react';

interface FloatingCTAsProps {
  onBookNow: () => void;
}

export const FloatingCTAs: React.FC<FloatingCTAsProps> = ({ onBookNow }) => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Desktop Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:flex flex-col items-end gap-3">
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            type="button"
            className="w-10 h-10 rounded-full bg-stone-900/80 hover:bg-stone-900 text-white shadow-md flex items-center justify-center transition-all hover:scale-105"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

        <a
          href="https://wa.me/919845012845?text=Hello%20Veda%20Aesthetic%20Clinic,%20I%20would%20like%20to%20enquire%20about%20a%20consultation."
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
          aria-label="Chat with Veda Clinic on WhatsApp"
        >
          <MessageSquare className="w-5 h-5 fill-current" />
          <span className="text-xs font-semibold tracking-wide">Chat With Clinic</span>
        </a>
      </div>

      {/* Mobile Bottom Fixed Conversion Bar (Strictly < 15% mobile viewport height) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-2.5 shadow-lg flex items-center justify-between gap-3">
        <a
          href="tel:+919845012845"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-100 active:bg-stone-200 text-stone-900 font-semibold text-xs transition-colors border border-stone-200"
        >
          <Phone className="w-4 h-4 text-amber-900" />
          <span>Call Clinic</span>
        </a>

        <a
          href="https://wa.me/919845012845?text=Hello%20Veda%20Clinic,%20I%20would%20like%20to%20enquire."
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl bg-emerald-50 active:bg-emerald-100 text-emerald-800 border border-emerald-200/80"
          aria-label="WhatsApp"
        >
          <MessageSquare className="w-4 h-4" />
        </a>

        <button
          onClick={onBookNow}
          type="button"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-900 active:bg-stone-800 text-white font-semibold text-xs transition-colors shadow-xs"
        >
          <Calendar className="w-4 h-4 text-amber-300" />
          <span>Book Now</span>
        </button>
      </div>
    </>
  );
};
