import React from 'react';
import { Calendar, ArrowRight, ShieldCheck, Star, Award, Phone } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

interface HeroProps {
  onBookNow: () => void;
  onExploreTreatments: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookNow, onExploreTreatments }) => {
  return (
    <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
      {/* Subtle organic background gradient mesh */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 -z-10 w-80 h-80 bg-stone-200/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Proposition and Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Quiet Location & Credential Kicker (Zero pill, clean unboxed text) */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-stone-600 tracking-wide uppercase">
              <span className="text-amber-900 font-semibold">Indiranagar, Bengaluru</span>
              <span aria-hidden="true" className="text-stone-300">/</span>
              <span>100 Feet Road</span>
              <span aria-hidden="true" className="text-stone-300">/</span>
              <span>NABH Accredited</span>
            </div>

            {/* Dominant Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-stone-900 leading-[1.1] text-balance">
              Clinical Precision Meets Bespoke Aesthetic Medicine.
            </h1>

            {/* Core Value Proposition */}
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl">
              Bengaluru’s premier doctor-led clinic for US-FDA cleared laser dermatology, advanced facial aesthetics, and restorative hair science. Directed by board-certified dermatologists with zero-pressure, science-first care.
            </p>

            {/* Actions: Primary CTA, Secondary CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={onBookNow}
                type="button"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-stone-900 hover:bg-stone-800 active:scale-[0.98] rounded-xl transition-all shadow-md hover:shadow-lg whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 text-amber-300" />
                <span>Book Consultation</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={onExploreTreatments}
                type="button"
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm sm:text-base font-medium text-stone-800 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl transition-colors whitespace-nowrap"
              >
                <span>Explore Treatments</span>
              </button>

              <a
                href="tel:+919845012845"
                className="inline-flex items-center gap-2 px-4 py-3.5 text-sm sm:text-base font-medium text-stone-700 hover:text-stone-950 transition-colors"
                title="Call clinic reception"
              >
                <Phone className="w-4 h-4 text-amber-800" />
                <span className="underline underline-offset-4 decoration-stone-300">080-4501-2845</span>
              </a>
            </div>

            {/* Adjacent Trust Proof Strip */}
            <div className="pt-8 border-t border-stone-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-stone-700">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-amber-900 font-semibold text-sm">
                  <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0" />
                  <span>US-FDA Tech</span>
                </div>
                <p className="text-xs text-stone-500">Lumenis & Alma Soprano</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-stone-900 font-semibold text-sm">
                  <Award className="w-4 h-4 text-amber-800 shrink-0" />
                  <span>MD Dermatologists</span>
                </div>
                <p className="text-xs text-stone-500">AIIMS Alumni Doctors</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-stone-900 font-semibold text-sm">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500 shrink-0" />
                  <span>4.9★ Google</span>
                </div>
                <p className="text-xs text-stone-500">842+ Verified Patient Reviews</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-stone-900 font-semibold text-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                  <span>Valet & Walk-in</span>
                </div>
                <p className="text-xs text-stone-500">100 Ft Rd, Indiranagar</p>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Asset (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-stone-200/80 shadow-xl bg-white p-2">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80"
                alt="Veda Aesthetic Clinic Indiranagar Consultation Suite"
                fallbackTitle="Veda Aesthetic Clinic"
                fallbackSubtitle="Indiranagar, Bengaluru"
                containerClassName="rounded-xl aspect-4/3 w-full"
                className="w-full h-full object-cover object-center"
              />

              {/* Floating Verified Trust Badge Card */}
              <div className="absolute bottom-5 left-5 right-5 sm:right-auto sm:max-w-xs bg-white/95 backdrop-blur-md p-4 rounded-xl border border-stone-200/80 shadow-lg space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-900">Clinical Excellence</span>
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs font-medium text-stone-900 leading-snug">
                  "Most meticulous skin analysis and ethical doctor consultation in Bengaluru."
                </p>
                <div className="text-[11px] text-stone-500">
                  Google Verified Patient · February 2026
                </div>
              </div>
            </div>

            {/* Decorative background element */}
            <div className="absolute -bottom-4 -right-4 w-full h-full -z-10 rounded-2xl border border-stone-300/40 pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  );
};
