import React from 'react';
import { X, CheckCircle, TrendingUp, Users, Shield, Smartphone, Globe, MessageSquare, ArrowRight } from 'lucide-react';

interface ClientPitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookNow: () => void;
}

export const ClientPitchModal: React.FC<ClientPitchModalProps> = ({
  isOpen,
  onClose,
  onBookNow
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/80 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white text-stone-900 rounded-3xl max-w-2xl w-full p-6 sm:p-10 space-y-6 shadow-2xl border border-stone-200 my-8">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900">
              <span>Agency Client Pitch & Value Proposal</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 mt-1">
              Why Veda Aesthetic Clinic Needs This Digital Platform
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors"
            aria-label="Close pitch modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pitch Body */}
        <div className="space-y-6 text-sm text-stone-700 leading-relaxed">
          
          {/* Problem */}
          <div className="bg-red-50/60 p-5 rounded-2xl border border-red-200/60 space-y-2">
            <h3 className="font-semibold text-red-950 flex items-center gap-2 text-base">
              <span>The Problem Local Clinics Face Today</span>
            </h3>
            <p className="text-red-900/80 text-xs sm:text-sm">
              High-value aesthetic clinics in prime locations (like 100 Feet Road, Indiranagar) often lose up to 60% of potential high-ticket clients because prospective patients cannot find a modern, trustworthy digital presence after discovering the clinic on Google Maps or Instagram. Outdated websites, missing transparent pricing, and friction in booking lead prospective patients straight to competing corporate chains.
            </p>
          </div>

          {/* Solution */}
          <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200/60 space-y-2">
            <h3 className="font-semibold text-amber-950 flex items-center gap-2 text-base">
              <span>The Solution: A Production-Grade Conversion Platform</span>
            </h3>
            <p className="text-amber-900/80 text-xs sm:text-sm">
              This bespoke, mobile-optimized web application positions Veda Aesthetic Clinic as the gold standard of evidence-based dermatology in Bengaluru. It balances warm medical serenity with aggressive conversion architecture—capturing inbound leads through seamless appointment booking, direct WhatsApp integration, and transparent treatment showcases.
            </p>
          </div>

          {/* Business Benefits */}
          <div className="space-y-3">
            <h3 className="font-serif text-xl font-normal text-stone-900">
              Direct Business ROI for the Clinic Owner
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>More Enquiries & Bookings</span>
                </div>
                <p className="text-stone-600">
                  Self-service booking form + instant WhatsApp link captures patients 24/7 without receptionist delays.
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                  <Shield className="w-4 h-4 text-amber-800" />
                  <span>Unshakable Patient Trust</span>
                </div>
                <p className="text-stone-600">
                  Detailed doctor credentials (AIIMS MD) and 842+ Google rating display dispel skepticism before arrival.
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>Local SEO Dominance</span>
                </div>
                <p className="text-stone-600">
                  LocalBusiness Schema.org and geo-metadata rank higher for "Dermatologist near Indiranagar".
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                  <Smartphone className="w-4 h-4 text-purple-600" />
                  <span>Flawless Mobile Experience</span>
                </div>
                <p className="text-stone-600">
                  Over 78% of local searches originate on phones. Thumb-friendly navigation guarantees zero drop-off.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action Quote */}
          <div className="bg-stone-900 text-white p-6 rounded-2xl space-y-3">
            <div className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
              Our Vision For Your Practice
            </div>
            <p className="font-serif text-lg sm:text-xl italic text-stone-100">
              "Let’s bring your business online and make it easier for customers to discover, trust and contact you."
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBookNow();
                }}
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs transition-colors"
              >
                <span>Test Live Booking Experience</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-medium text-xs transition-colors"
              >
                Return to Clinic Website
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
