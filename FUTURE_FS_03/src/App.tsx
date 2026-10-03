import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { WhyChooseUs } from './components/WhyChooseUs';
import { Gallery } from './components/Gallery';
import { Reviews } from './components/Reviews';
import { SpecialOffer } from './components/SpecialOffer';
import { BookingForm } from './components/BookingForm';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingCTAs } from './components/FloatingCTAs';
import { ClientPitchModal } from './components/ClientPitchModal';
import { Treatment } from './types';

export default function App() {
  const [isPitchOpen, setIsPitchOpen] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [appliedPromo, setAppliedPromo] = useState<string>('');

  const scrollToBooking = () => {
    const el = document.getElementById('booking');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTreatments = () => {
    const el = document.getElementById('treatments');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectTreatment = (treatment: Treatment) => {
    setSelectedTreatment(treatment);
    scrollToBooking();
  };

  const handleClaimOffer = (code: string) => {
    setAppliedPromo(code);
    scrollToBooking();
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 font-sans selection:bg-amber-900/10 selection:text-amber-900 flex flex-col">
      {/* Navigation */}
      <Navbar
        onOpenPitch={() => setIsPitchOpen(true)}
        onBookNow={scrollToBooking}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onBookNow={scrollToBooking}
          onExploreTreatments={scrollToTreatments}
        />

        {/* About Us & Doctors Section */}
        <About />

        {/* Services & Treatments Showcase */}
        <Services
          onSelectTreatmentForBooking={handleSelectTreatment}
        />

        {/* Why Choose Us */}
        <WhyChooseUs />

        {/* Limited Time Promotion */}
        <SpecialOffer
          onClaimOffer={handleClaimOffer}
        />

        {/* Clinic & Ambiance Gallery */}
        <Gallery />

        {/* Patient Reviews & Google Score */}
        <Reviews />

        {/* Online Booking & Consultation Form */}
        <BookingForm
          preselectedTreatment={selectedTreatment}
          prefilledPromoCode={appliedPromo}
          onClearPreselection={() => {
            setSelectedTreatment(null);
            setAppliedPromo('');
          }}
        />

        {/* FAQ Accordion */}
        <FaqSection />

        {/* Contact, Hours & Google Maps Directions */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenPitch={() => setIsPitchOpen(true)}
        onBookNow={scrollToBooking}
      />

      {/* Floating Conversion CTAs (WhatsApp, Call, Book) */}
      <FloatingCTAs
        onBookNow={scrollToBooking}
      />

      {/* Agency Client Pitch Deck Modal */}
      <ClientPitchModal
        isOpen={isPitchOpen}
        onClose={() => setIsPitchOpen(false)}
        onBookNow={() => {
          setIsPitchOpen(false);
          scrollToBooking();
        }}
      />
    </div>
  );
}
