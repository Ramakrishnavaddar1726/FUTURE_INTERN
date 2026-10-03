import React, { useState } from 'react';
import { Phone, Mail, MapPin, ArrowUp, Briefcase, X, Shield, FileText } from 'lucide-react';

interface FooterProps {
  onOpenPitch: () => void;
  onBookNow: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPitch, onBookNow }) => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-24 lg:pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Tier */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand & Mission (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <span className="font-serif text-2xl font-semibold text-white tracking-tight block">
              Veda Aesthetic Clinic
            </span>
            <p className="text-stone-400 text-sm leading-relaxed max-w-sm">
              Premier doctor-led dermatology, clinical laser rejuvenation, and restorative hair science in Indiranagar, Bengaluru. Grounded in clinical evidence and unhurried care.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenPitch}
                type="button"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-medium border border-amber-900/40 transition-colors"
              >
                <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                <span>Client Pitch & Business ROI Deck</span>
              </button>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
              Navigation
            </span>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <a href="#about" className="hover:text-white transition-colors">About Doctors</a>
              </li>
              <li>
                <a href="#treatments" className="hover:text-white transition-colors">Clinical Treatments</a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-white transition-colors">The Veda Standard</a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors">Clinic Gallery</a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-white transition-colors">Patient Reviews</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">Location & Hours</a>
              </li>
            </ul>
          </div>

          {/* Popular Treatments (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
              Featured Treatments
            </span>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button onClick={onBookNow} className="hover:text-white transition-colors text-left">
                  HydraFacial MD® Elite
                </button>
              </li>
              <li>
                <button onClick={onBookNow} className="hover:text-white transition-colors text-left">
                  Tri-Beam Q-Switched Melasma Laser
                </button>
              </li>
              <li>
                <button onClick={onBookNow} className="hover:text-white transition-colors text-left">
                  PRF Biological Hair Restoration
                </button>
              </li>
              <li>
                <button onClick={onBookNow} className="hover:text-white transition-colors text-left">
                  Alma Soprano Titanium Laser Hair
                </button>
              </li>
              <li>
                <button onClick={onBookNow} className="hover:text-white transition-colors text-left">
                  Profhilo® Hyaluronic Bio-Remodelling
                </button>
              </li>
            </ul>
          </div>

          {/* Clinic Contact (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
              Clinic Reception
            </span>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Plot 742, 2nd Floor, 100 Ft Rd, Indiranagar, Bengaluru 560038</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+919845012845" className="hover:text-white">+91 98450 12845</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:care@vedaaesthetic.in" className="hover:text-white">care@vedaaesthetic.in</a>
              </div>
              <div className="pt-1 text-stone-500 text-[11px]">
                Mon–Sat: 10 AM – 8 PM · Sun: 10 AM – 5 PM
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Tier: Copyright, Legal, Back to top */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © 2026 Veda Aesthetic Clinic & Wellness Lounge. All Rights Reserved.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveModal('privacy')}
              className="hover:text-stone-300 transition-colors"
            >
              Privacy Policy
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveModal('terms')}
              className="hover:text-stone-300 transition-colors"
            >
              Terms & Patient Rights
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-amber-400 transition-colors"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Privacy Policy / Terms Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs">
          <div className="bg-white text-stone-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-stone-200 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                {activeModal === 'privacy' ? (
                  <Shield className="w-5 h-5 text-amber-900" />
                ) : (
                  <FileText className="w-5 h-5 text-amber-900" />
                )}
                <h3 className="font-serif text-xl font-normal">
                  {activeModal === 'privacy' ? 'Patient Privacy Policy' : 'Terms & Clinical Protocols'}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs sm:text-sm text-stone-600 space-y-3 max-h-80 overflow-y-auto pr-1 leading-relaxed">
              {activeModal === 'privacy' ? (
                <>
                  <p>
                    At Veda Aesthetic Clinic, patient confidentiality is held to statutory medical ethical standards. All clinical photography and 3D skin diagnostic images are stored in encrypted electronic medical records (EMR) accessible only by treating dermatologists.
                  </p>
                  <p>
                    We never sell, rent, or share personal phone numbers, emails, or treatment histories with third-party advertisers or cosmetic marketing networks.
                  </p>
                  <p>
                    Communication via WhatsApp or SMS is strictly transactional regarding appointment confirmations and pre/post-procedure guidance.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    All diagnostic consultations, aesthetic procedures, and laser therapies are governed by Indian Council of Medical Research (ICMR) clinical governance.
                  </p>
                  <p>
                    A written consent document detailing procedure mechanisms, potential transient reactions, and post-procedure sun-care instructions will be reviewed and signed prior to any intervention.
                  </p>
                  <p>
                    Appointments may be rescheduled up to 4 hours in advance at zero penalty.
                  </p>
                </>
              )}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
