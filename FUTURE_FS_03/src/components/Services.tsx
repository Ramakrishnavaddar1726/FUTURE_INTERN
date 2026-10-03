import React, { useState } from 'react';
import { Clock, Check, Sparkles, ArrowRight, Info, X } from 'lucide-react';
import { TREATMENTS_DATA } from '../data/treatments';
import { Treatment } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface ServicesProps {
  onSelectTreatmentForBooking: (treatment: Treatment) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectTreatmentForBooking }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalTreatment, setActiveModalTreatment] = useState<Treatment | null>(null);

  const categories = [
    { id: 'all', label: 'All Treatments' },
    { id: 'facial', label: 'Facial Aesthetics' },
    { id: 'laser', label: 'Laser & Skin' },
    { id: 'hair', label: 'Hair Restoration' },
    { id: 'antiaging', label: 'Anti-Aging & Wellness' },
  ];

  const filteredTreatments = selectedCategory === 'all'
    ? TREATMENTS_DATA
    : TREATMENTS_DATA.filter((t) => t.category === selectedCategory);

  return (
    <section id="treatments" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900">
            <span>Clinical Treatments</span>
            <span aria-hidden="true">·</span>
            <span>Evidence-Based Dermatology</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 text-balance">
            Targeted Therapies for Skin, Hair & Vitality.
          </h2>
          <p className="text-stone-600 text-base sm:text-lg">
            Every procedure is personalized to your skin’s unique physiology, utilizing US-FDA cleared medical lasers and dermatological grade actives.
          </p>
        </div>

        {/* Category Filter Controls (Functional interactive segmented control) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-stone-100 rounded-xl border border-stone-200/80">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              type="button"
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Treatments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTreatments.map((treatment) => (
          <div
            key={treatment.id}
            className="group flex flex-col bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
          >
            {/* Image Header with Fallback */}
            <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-100">
              <ImageWithFallback
                src={treatment.image}
                alt={treatment.name}
                fallbackTitle={treatment.name}
                fallbackSubtitle={treatment.categoryLabel}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Quiet unboxed Category & Duration */}
              <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-md flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-amber-300" />
                <span>{treatment.duration}</span>
              </div>

              {treatment.isPopular && (
                <div className="absolute top-3 right-3 bg-amber-900 text-amber-100 text-[11px] font-medium px-2.5 py-1 rounded-md flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Signature</span>
                </div>
              )}
            </div>

            {/* Card Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <span>{treatment.categoryLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{treatment.recommendedSessions}</span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-normal text-stone-900 leading-snug">
                  {treatment.name}
                </h3>

                <p className="text-stone-600 text-sm leading-relaxed line-clamp-2">
                  {treatment.shortDescription}
                </p>
              </div>

              {/* Benefits Checklist */}
              <div className="space-y-1.5 pt-2 border-t border-stone-100">
                {treatment.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-stone-600">
                    <Check className="w-3.5 h-3.5 text-amber-800 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Pricing & Actions */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-2xl font-semibold text-stone-900 tabular-nums">
                      ₹{treatment.price.toLocaleString('en-IN')}
                    </span>
                    {treatment.originalPrice && (
                      <span className="text-xs text-stone-400 line-through tabular-nums">
                        ₹{treatment.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-stone-500">per clinical session</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveModalTreatment(treatment)}
                    type="button"
                    className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                    title="View treatment details"
                    aria-label={`View details for ${treatment.name}`}
                  >
                    <Info className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onSelectTreatmentForBooking(treatment)}
                    type="button"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 active:scale-[0.98] rounded-lg transition-all shadow-xs whitespace-nowrap"
                  >
                    <span>Book</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Clinical Details Modal */}
      {activeModalTreatment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase font-semibold text-amber-900 tracking-wider">
                  {activeModalTreatment.categoryLabel}
                </span>
                <h3 className="font-serif text-2xl text-stone-900 mt-1">
                  {activeModalTreatment.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalTreatment(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-stone-600 text-sm leading-relaxed">
              {activeModalTreatment.fullDescription}
            </p>

            <div className="bg-stone-50 p-4 rounded-xl space-y-2 text-xs text-stone-700">
              <div className="flex justify-between">
                <span className="font-medium">Estimated Duration:</span>
                <span>{activeModalTreatment.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Recommended Protocol:</span>
                <span>{activeModalTreatment.recommendedSessions}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Doctor Supervised:</span>
                <span className="text-emerald-700 font-semibold">Yes, MD Dermatologist</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="font-serif text-2xl font-semibold text-stone-900 tabular-nums">
                  ₹{activeModalTreatment.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-stone-500 block">tax & consumables included</span>
              </div>

              <button
                onClick={() => {
                  const t = activeModalTreatment;
                  setActiveModalTreatment(null);
                  onSelectTreatmentForBooking(t);
                }}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-all shadow-xs"
              >
                Proceed to Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
