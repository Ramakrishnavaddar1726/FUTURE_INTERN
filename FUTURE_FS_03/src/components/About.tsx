import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, Shield, HeartHandshake } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

export const About: React.FC = () => {
  // Animated numerical counters
  const [stats, setStats] = useState({
    years: 0,
    clients: 0,
    rating: 0,
    compliance: 0
  });

  useEffect(() => {
    const duration = 1500;
    const steps = 30;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setStats({
        years: Math.min(12, Math.floor(progress * 12)),
        clients: Math.min(15000, Math.floor(progress * 15000)),
        rating: +(progress * 4.9).toFixed(1),
        compliance: Math.min(100, Math.floor(progress * 100))
      });

      if (step >= steps) {
        clearInterval(timer);
        setStats({ years: 12, clients: 15000, rating: 4.9, compliance: 100 });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="about" className="py-20 lg:py-28 bg-[#F5F4F0] border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Subheader & Title */}
        <div className="max-w-3xl mb-16 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900">
            <span>Our Philosophy</span>
            <span aria-hidden="true">·</span>
            <span>Est. 2014 in Bengaluru</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 text-balance">
            Where Evidence-Based Dermatology Meets Conscious Aesthetics.
          </h2>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
            Veda Aesthetic Clinic was founded with a singular conviction: skincare should be rooted in uncompromising clinical science, performed strictly by accredited medical doctors, and delivered with unhurried warmth.
          </p>
        </div>

        {/* 2-Column Content: Story + Doctors */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left: The Clinical Story & Pillars (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-4">
              <p>
                In a wellness landscape crowded with generic medispas and aggressive sales quotas, Veda stands apart as a sanctuary of clinical integrity. We believe that your skin is an intricate biological organ requiring diagnostic nuance—not cookie-cutter packages.
              </p>
              <p>
                Every treatment regimen begins with comprehensive multispectral skin mapping. We look beneath the surface to evaluate sebum distribution, melanin concentrations, and microvascular activity. From chronic hyperpigmentation and hormonal acne to restorative anti-aging, our protocols harmonize US-FDA cleared technologies with gentle botanical recovery.
              </p>
            </div>

            {/* 4 Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-semibold text-stone-900 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-amber-800 shrink-0" />
                  <span>Doctor-Administered Care</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Every laser pass and clinical injectable is personally evaluated and supervised by board-certified MD dermatologists.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 font-semibold text-stone-900 text-sm">
                  <Shield className="w-4 h-4 text-amber-800 shrink-0" />
                  <span>Zero Compromise Safety</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Autoclave Class-B surgical sterilization, single-use consumable kits, and authentic manufacturer-sealed biologicals.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 font-semibold text-stone-900 text-sm">
                  <Award className="w-4 h-4 text-amber-800 shrink-0" />
                  <span>Holistic Skin Health</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  We address the systemic roots of skin and hair distress, advising on circadian rhythm, nutrition, and home care.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 font-semibold text-stone-900 text-sm">
                  <HeartHandshake className="w-4 h-4 text-amber-800 shrink-0" />
                  <span>Honest, Transparent Pricing</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Clear itemized estimates shared before any procedure. No high-pressure sales pitches or sudden hidden clinic fees.
                </p>
              </div>
            </div>

            {/* Live Numerical Stats Bar (Tabular discipline) */}
            <div className="pt-6 border-t border-stone-300/70 grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className="font-serif text-3xl sm:text-4xl font-normal text-stone-900 tabular-nums">
                  {stats.years}+
                </p>
                <p className="text-xs text-stone-600 font-medium mt-1">Years of Excellence</p>
              </div>

              <div>
                <p className="font-serif text-3xl sm:text-4xl font-normal text-stone-900 tabular-nums">
                  {stats.clients.toLocaleString()}+
                </p>
                <p className="text-xs text-stone-600 font-medium mt-1">Treated Patients</p>
              </div>

              <div>
                <p className="font-serif text-3xl sm:text-4xl font-normal text-amber-900 tabular-nums">
                  {stats.rating.toFixed(1)}★
                </p>
                <p className="text-xs text-stone-600 font-medium mt-1">Google Rating (842+)</p>
              </div>

              <div>
                <p className="font-serif text-3xl sm:text-4xl font-normal text-stone-900 tabular-nums">
                  {stats.compliance}%
                </p>
                <p className="text-xs text-stone-600 font-medium mt-1">FDA-Cleared Devices</p>
              </div>
            </div>

          </div>

          {/* Right: Medical Leadership Profiles (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-900">Medical Directors</span>
                <h3 className="font-serif text-2xl text-stone-900 mt-1">Board-Certified Specialists</h3>
              </div>

              {/* Doctor 1 */}
              <div className="flex gap-4 items-start">
                <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border border-stone-200">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1594824813593-94c65330a597?auto=format&fit=crop&w=300&q=80"
                    alt="Dr. Ananya Rao MD Dermatology"
                    fallbackTitle="Dr. Rao"
                    fallbackSubtitle="MD"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-stone-900 text-base">Dr. Ananya Rao, MD</h4>
                  <div className="text-xs text-amber-900 font-medium">Chief Dermatologist & Medical Director</div>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    AIIMS New Delhi Gold Medalist. 12+ years specializing in laser resurfacing, pigmentary disorders, and bespoke clinical dermatology.
                  </p>
                </div>
              </div>

              {/* Doctor 2 */}
              <div className="flex gap-4 items-start pt-4 border-t border-stone-100">
                <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border border-stone-200">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80"
                    alt="Dr. Vikramaditya Sen Facial Aesthetics"
                    fallbackTitle="Dr. Sen"
                    fallbackSubtitle="Cosmetology"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-stone-900 text-base">Dr. Vikramaditya Sen, MDS</h4>
                  <div className="text-xs text-amber-900 font-medium">Facial Aesthetics & Clinical Cosmetology</div>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Fellowship in Facial Aesthetics (Harley Street, London). Renowned for natural, harmonious facial rejuvenation and non-surgical bio-remodelling.
                  </p>
                </div>
              </div>

              <div className="bg-stone-50 rounded-xl p-4 text-xs text-stone-600 leading-relaxed border border-stone-200/60">
                <strong className="text-stone-900 font-medium">Doctor’s Promise: </strong>
                "We never perform a procedure simply because it is trending. We only advise therapies that deliver tangible biological improvements for your skin."
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
