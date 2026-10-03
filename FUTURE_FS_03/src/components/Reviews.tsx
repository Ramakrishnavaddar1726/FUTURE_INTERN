import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, CheckCircle, Quote } from 'lucide-react';
import { REVIEWS_DATA } from '../data/reviews';
import { ImageWithFallback } from './ImageWithFallback';

export const Reviews: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === REVIEWS_DATA.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? REVIEWS_DATA.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === REVIEWS_DATA.length - 1 ? 0 : prev + 1));
  };

  const currentReview = REVIEWS_DATA[currentIndex];

  return (
    <section id="reviews" className="py-20 lg:py-28 bg-[#F5F4F0] border-y border-stone-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900">
              <span>Patient Experiences</span>
              <span aria-hidden="true">·</span>
              <span>Documented Clinical Outcomes</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 text-balance">
              Trusted by 15,000+ Discerning Patients in Bengaluru.
            </h2>
            <p className="text-stone-600 text-base sm:text-lg">
              Read how our personalized, doctor-administered therapies have transformed skin confidence, hair vitality, and overall well-being.
            </p>
          </div>

          {/* Google Proof Scorecard */}
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-3xl font-bold text-stone-900 tabular-nums">4.9</span>
                <span className="text-stone-400 text-base font-normal">/ 5.0</span>
              </div>
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-stone-500">Based on 842+ Google Reviews</p>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200/60">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Clinic</span>
              </span>
            </div>
          </div>
        </div>

        {/* Carousel Slider */}
        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-sm relative transition-all duration-300">
            <Quote className="absolute top-6 right-8 w-12 h-12 text-stone-100 -z-0 pointer-events-none" />

            <div className="relative z-10 space-y-6">
              
              {/* Rating & Treatment unboxed metadata */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-500">
                    {[...Array(currentReview.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-stone-900">5.0 Star Rating</span>
                </div>

                <div className="text-xs font-medium text-amber-900 bg-amber-50/80 px-3 py-1 rounded-md border border-amber-200/50">
                  Treatment: {currentReview.treatment}
                </div>
              </div>

              {/* Review Text */}
              <p className="font-serif text-xl sm:text-2xl text-stone-800 leading-relaxed italic">
                "{currentReview.comment}"
              </p>

              {/* Reviewer Details */}
              <div className="flex items-center justify-between pt-6 border-t border-stone-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-stone-200">
                    <ImageWithFallback
                      src={currentReview.avatar}
                      alt={currentReview.author}
                      fallbackTitle={currentReview.author}
                      fallbackSubtitle="Patient"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-stone-900 text-base">
                        {currentReview.author}
                      </h4>
                      {currentReview.verified && (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>Verified Patient</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500">
                      {currentReview.role} · {currentReview.date}
                    </p>
                  </div>
                </div>

                {/* Arrow Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    type="button"
                    className="p-2.5 rounded-full border border-stone-200 hover:bg-stone-50 text-stone-600 hover:text-stone-950 transition-colors"
                    aria-label="Previous review"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    type="button"
                    className="p-2.5 rounded-full border border-stone-200 hover:bg-stone-50 text-stone-600 hover:text-stone-950 transition-colors"
                    aria-label="Next review"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {REVIEWS_DATA.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentIndex === idx ? 'w-8 bg-amber-900' : 'w-2 bg-stone-300 hover:bg-stone-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
