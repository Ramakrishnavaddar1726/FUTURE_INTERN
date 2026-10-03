import React, { useState, useEffect } from 'react';
import { Tag, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface SpecialOfferProps {
  onClaimOffer: (promoCode: string) => void;
}

export const SpecialOffer: React.FC<SpecialOfferProps> = ({ onClaimOffer }) => {
  // 5-day countdown timer from now
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 18,
    minutes: 42,
    seconds: 35
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const promoCode = 'VEDAGLOW25';

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl bg-stone-900 text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-xl border border-stone-800">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-700/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Details (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-900/60 border border-amber-600/40 text-amber-200 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Seasonal Privilege Package</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-white">
              The Bengaluru Radiance Suite: 25% Off
            </h2>

            <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-xl">
              Receive a comprehensive 3-stage rejuvenation protocol combining original HydraFacial MD® Elite, Tri-Beam Q-Switched clarity pass, and cold-pressed botanical barrier infusion.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-6 text-sm text-stone-300">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-400" />
                <span>Promo Code: <strong className="text-white tracking-wider font-mono">{promoCode}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Valid for new & returning clients</span>
              </div>
            </div>
          </div>

          {/* Right Timer & CTA (5 cols) */}
          <div className="lg:col-span-5 bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold block mb-3">
                Offer Expiration Countdown
              </span>
              
              {/* Countdown Digits */}
              <div className="grid grid-cols-4 gap-2.5 text-center">
                <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700/60">
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-white tabular-nums">
                    {String(timeLeft.days).padStart(2, '0')}
                  </div>
                  <span className="text-[10px] sm:text-xs text-stone-400 uppercase tracking-wider">Days</span>
                </div>

                <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700/60">
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-white tabular-nums">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <span className="text-[10px] sm:text-xs text-stone-400 uppercase tracking-wider">Hours</span>
                </div>

                <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700/60">
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-white tabular-nums">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <span className="text-[10px] sm:text-xs text-stone-400 uppercase tracking-wider">Mins</span>
                </div>

                <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700/60">
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-amber-400 tabular-nums">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <span className="text-[10px] sm:text-xs text-stone-400 uppercase tracking-wider">Secs</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => onClaimOffer(promoCode)}
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm sm:text-base transition-colors shadow-lg shadow-amber-500/20 active:scale-[0.99]"
            >
              <span>Apply Offer & Book Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-stone-400 text-center">
              Includes pre-procedure 3D skin analysis by MD Dermatologist.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
