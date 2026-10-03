import React from 'react';
import { ShieldCheck, Stethoscope, Sparkles, Clock, FileText, MapPin } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const differentiators = [
    {
      icon: ShieldCheck,
      title: 'US-FDA Cleared Technology',
      description: 'We invest exclusively in gold-standard, clinically validated systems (Alma Soprano, Tri-Beam Nd:YAG) to ensure maximum efficacy and skin safety.'
    },
    {
      icon: Stethoscope,
      title: 'Board-Certified MD Doctors',
      description: 'Consultations, diagnostic skin imaging, and active laser protocols are directly evaluated and administered by accredited MD Dermatologists.'
    },
    {
      icon: Sparkles,
      title: 'Hospital-Grade Sterilization',
      description: 'Class-B vacuum autoclaving, HEPA cleanroom air treatment, and single-use sealed medical consumables eliminate any cross-contamination risk.'
    },
    {
      icon: FileText,
      title: 'Transparent, Ethical Pricing',
      description: 'Itemized pricing disclosed prior to treatment. We never practice predatory sales quotas or pressure you into unwarranted long-term loans.'
    },
    {
      icon: Clock,
      title: 'Minimal to Zero Downtime',
      description: 'Our non-ablative laser passes and medical hydra-infusions are calibrated so you can resume your active personal and professional routine immediately.'
    },
    {
      icon: MapPin,
      title: 'Prime Indiranagar Location',
      description: 'Located in the heart of Bengaluru on 100 Feet Road with dedicated valet parking and quiet botanical suites designed for complete privacy.'
    }
  ];

  return (
    <section id="why-us" className="py-20 lg:py-28 bg-[#F5F4F0] border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900">
            <span>The Veda Standard</span>
            <span aria-hidden="true">·</span>
            <span>Why Patients Trust Us</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 text-balance">
            Setting the Benchmark for Ethical Clinical Care in Bengaluru.
          </h2>
          <p className="text-stone-600 text-base sm:text-lg">
            We reject the aggressive sales culture of commercial medispas. Here is how our commitment to scientific dermatology protects your health and outcomes.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {differentiators.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-7 border border-stone-200/80 shadow-xs hover:border-amber-900/30 transition-all space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-200/60">
                  <Icon className="w-6 h-6 text-amber-900" />
                </div>
                <h3 className="font-serif text-xl font-normal text-stone-900">
                  {item.title}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
