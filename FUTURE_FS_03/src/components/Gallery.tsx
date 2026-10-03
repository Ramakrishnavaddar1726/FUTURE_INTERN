import React, { useState } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GALLERY_DATA } from '../data/gallery';
import { GalleryItem } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

export const Gallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'ambiance', label: 'Clinic Ambiance' },
    { id: 'suites', label: 'Treatment Suites' },
    { id: 'technology', label: 'Technology' },
    { id: 'consultation', label: 'Consultation' },
  ];

  const filteredItems = selectedCategory === 'all'
    ? GALLERY_DATA
    : GALLERY_DATA.filter((item) => item.category === selectedCategory);

  const handlePrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === 0 ? filteredItems.length - 1 : lightboxIndex - 1);
    }
  };

  const handleNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === filteredItems.length - 1 ? 0 : lightboxIndex + 1);
    }
  };

  return (
    <section id="gallery" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900">
            <span>Inside Veda Clinic</span>
            <span aria-hidden="true">·</span>
            <span>A Sanctuary of Rest</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 text-balance">
            Designed for Serenity, Privacy & Sterile Precision.
          </h2>
          <p className="text-stone-600 text-base sm:text-lg">
            Experience our purpose-built suites on 100 Feet Road, Indiranagar. Natural daylight, acoustic isolation, and medical-grade air purification.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-stone-100 rounded-xl border border-stone-200/80">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              type="button"
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                selectedCategory === cat.id
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setLightboxIndex(idx)}
            className="group relative rounded-2xl overflow-hidden cursor-pointer border border-stone-200/80 bg-stone-100 aspect-4/3 shadow-xs hover:shadow-md transition-all"
          >
            <ImageWithFallback
              src={item.image}
              alt={item.title}
              fallbackTitle={item.title}
              fallbackSubtitle={item.categoryLabel}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Gradient Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
              <span className="text-xs text-amber-300 font-medium tracking-wide uppercase">
                {item.categoryLabel}
              </span>
              <h3 className="font-serif text-lg font-medium text-white mt-0.5">
                {item.title}
              </h3>
              <p className="text-xs text-stone-200 mt-1 line-clamp-1">
                {item.description}
              </p>
              <div className="mt-3 flex items-center gap-1 text-[11px] text-amber-200 font-medium">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Click to expand</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 p-2 text-stone-400 hover:text-white bg-stone-900/60 rounded-full transition-colors z-10"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white bg-stone-900/70 hover:bg-stone-800 rounded-full transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next */}
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white bg-stone-900/70 hover:bg-stone-800 rounded-full transition-colors"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Modal Content */}
          <div className="max-w-4xl w-full mx-auto space-y-4">
            <div className="rounded-2xl overflow-hidden max-h-[75vh] flex items-center justify-center bg-black/40">
              <img
                src={filteredItems[lightboxIndex].image}
                alt={filteredItems[lightboxIndex].title}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl"
              />
            </div>
            <div className="text-center text-white space-y-1">
              <span className="text-xs uppercase tracking-widest text-amber-300 font-medium">
                {filteredItems[lightboxIndex].categoryLabel} · Image {lightboxIndex + 1} of {filteredItems.length}
              </span>
              <h3 className="font-serif text-2xl font-normal">
                {filteredItems[lightboxIndex].title}
              </h3>
              <p className="text-sm text-stone-300 max-w-lg mx-auto">
                {filteredItems[lightboxIndex].description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
