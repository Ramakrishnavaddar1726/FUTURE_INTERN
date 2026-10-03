import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQS_DATA } from '../data/faqs';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 lg:py-28 bg-[#F5F4F0] border-y border-stone-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900">
            <HelpCircle className="w-3.5 h-3.5 text-amber-800" />
            <span>Common Questions</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 text-balance">
            Frequently Asked Questions
          </h2>
          <p className="text-stone-600 text-base">
            Everything you need to know about our medical consultations, treatment protocols, and clinic standards.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-4">
          {FAQS_DATA.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-hidden"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-lg sm:text-xl font-normal text-stone-900">
                    {faq.question}
                  </span>
                  <div className={`p-1 rounded-full bg-stone-100 text-stone-600 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 bg-amber-100 text-amber-900' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-stone-600 leading-relaxed border-t border-stone-100 animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
                    <span className="inline-block mt-3 text-xs text-amber-900 font-medium">
                      Category: {faq.category}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Help footer note */}
        <div className="mt-12 text-center text-xs sm:text-sm text-stone-500">
          Have a more specific medical query?{' '}
          <a
            href="tel:+919845012845"
            className="text-amber-900 font-semibold hover:underline"
          >
            Speak directly with our clinical coordinator
          </a>
        </div>

      </div>
    </section>
  );
};
