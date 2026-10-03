import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle, Phone, MessageSquare, Tag, X, User } from 'lucide-react';
import { TREATMENTS_DATA } from '../data/treatments';
import { BookingData, Treatment } from '../types';

interface BookingFormProps {
  preselectedTreatment?: Treatment | null;
  prefilledPromoCode?: string;
  onClearPreselection?: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  preselectedTreatment,
  prefilledPromoCode,
  onClearPreselection
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    serviceId: '',
    date: '',
    timeSlot: 'Morning (10:00 AM – 01:00 PM)',
    promoCode: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedBooking, setSubmittedBooking] = useState<BookingData | null>(null);
  const [savedBookings, setSavedBookings] = useState<BookingData[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Sync preselected treatment or promo code
  useEffect(() => {
    if (preselectedTreatment) {
      setFormData((prev) => ({ ...prev, serviceId: preselectedTreatment.id }));
    }
  }, [preselectedTreatment]);

  useEffect(() => {
    if (prefilledPromoCode) {
      setFormData((prev) => ({ ...prev, promoCode: prefilledPromoCode }));
    }
  }, [prefilledPromoCode]);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('veda_clinic_bookings');
      if (stored) {
        setSavedBookings(JSON.parse(stored));
      }
    } catch {
      // LocalStorage access fail-safe
    }
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Please enter your full name';
    } else if (formData.fullName.trim().length < 3) {
      errs.fullName = 'Name must be at least 3 characters';
    }

    // Indian phone number validation: 10 digits, optionally starting with +91 or 0
    const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^(\+91|91|0)?[6-9]\d{9}$/;
    if (!cleanPhone) {
      errs.phone = 'Please enter your phone number';
    } else if (!phoneRegex.test(cleanPhone)) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Please enter your email address';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email format';
    }

    if (!formData.serviceId) {
      errs.serviceId = 'Please select a treatment or general consultation';
    }

    if (!formData.date) {
      errs.date = 'Please pick a preferred date';
    } else {
      const selected = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        errs.date = 'Date cannot be in the past';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const matchedService = TREATMENTS_DATA.find((t) => t.id === formData.serviceId);
    const serviceName = matchedService ? matchedService.name : 'General Doctor Consultation';

    const newBooking: BookingData = {
      id: `VEDA-${Math.floor(100000 + Math.random() * 900000)}`,
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      serviceId: formData.serviceId,
      serviceName,
      date: formData.date,
      timeSlot: formData.timeSlot,
      promoCode: formData.promoCode.trim().toUpperCase() || undefined,
      notes: formData.notes.trim() || undefined,
      createdAt: new Date().toISOString()
    };

    const updated = [newBooking, ...savedBookings];
    setSavedBookings(updated);
    try {
      localStorage.setItem('veda_clinic_bookings', JSON.stringify(updated));
    } catch {
      // ignore
    }

    setSubmittedBooking(newBooking);
    // Reset form
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      serviceId: '',
      date: '',
      timeSlot: 'Morning (10:00 AM – 01:00 PM)',
      promoCode: '',
      notes: ''
    });
    setErrors({});
    if (onClearPreselection) onClearPreselection();
  };

  // Min date for date picker (today in YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <section id="booking" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Informational Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900">
              <span>Appointment Desk</span>
              <span aria-hidden="true">·</span>
              <span>Indiranagar Clinic</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 text-balance">
              Request Your Private Consultation.
            </h2>
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
              Experience focused, one-on-one diagnostic care with our medical dermatologists. We allocate unhurried 30-minute consultation windows for every patient.
            </p>
          </div>

          <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200/80 space-y-4">
            <h3 className="font-serif text-lg font-medium text-stone-900">What to Expect</h3>
            
            <ul className="space-y-3 text-sm text-stone-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <span>3D multispectral skin imaging report</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <span>Direct consultation with MD Dermatologist</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <span>Transparent treatment plan with zero sales pressure</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <span>Complimentary valet parking on 100 Feet Road</span>
              </li>
            </ul>

            <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
              <span>Need instant assistance?</span>
              <a
                href="https://wa.me/919845012845?text=Hello%20Veda%20Aesthetic%20Clinic,%20I%20would%20like%20to%20enquire%20about%20a%20consultation."
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-amber-900 hover:underline flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Desk</span>
              </a>
            </div>
          </div>

          {/* Stored Enquiries Link */}
          {savedBookings.length > 0 && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className="text-xs text-stone-600 hover:text-stone-900 underline underline-offset-4 decoration-stone-300 flex items-center gap-1"
              >
                <span>View My Recent Appointments ({savedBookings.length})</span>
              </button>
            </div>
          )}

          {/* Stored Appointments View */}
          {showHistory && savedBookings.length > 0 && (
            <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold text-stone-900 border-b pb-2">
                <span>Recent Appointment Requests</span>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-stone-400 hover:text-stone-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {savedBookings.slice(0, 3).map((item) => (
                  <div key={item.id} className="text-xs p-2.5 bg-stone-50 rounded-lg space-y-0.5">
                    <div className="flex justify-between font-medium text-stone-900">
                      <span>{item.serviceName}</span>
                      <span className="font-mono text-amber-900">{item.id}</span>
                    </div>
                    <div className="text-stone-500">
                      {item.date} · {item.timeSlot.split(' ')[0]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Form Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                Full Name <span className="text-amber-800">*</span>
              </label>
              <div className="relative">
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Radhika Sharma"
                  className={`w-full px-4 py-3 text-sm rounded-xl border bg-stone-50/50 text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-900/20 transition-all ${
                    errors.fullName ? 'border-red-400 bg-red-50/30' : 'border-stone-200'
                  }`}
                />
                <User className="absolute right-3.5 top-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.fullName}</span>
                </p>
              )}
            </div>

            {/* Phone & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                  Mobile Number <span className="text-amber-800">*</span>
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 98450 12345"
                    className={`w-full px-4 py-3 text-sm rounded-xl border bg-stone-50/50 text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-900/20 transition-all ${
                      errors.phone ? 'border-red-400 bg-red-50/30' : 'border-stone-200'
                    }`}
                  />
                  <Phone className="absolute right-3.5 top-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                  Email Address <span className="text-amber-800">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="radhika@example.com"
                  className={`w-full px-4 py-3 text-sm rounded-xl border bg-stone-50/50 text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-900/20 transition-all ${
                    errors.email ? 'border-red-400 bg-red-50/30' : 'border-stone-200'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Service Selection */}
            <div>
              <label htmlFor="service" className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                Select Treatment / Consultation <span className="text-amber-800">*</span>
              </label>
              <select
                id="service"
                value={formData.serviceId}
                onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                className={`w-full px-4 py-3 text-sm rounded-xl border bg-stone-50/50 text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-900/20 transition-all ${
                  errors.serviceId ? 'border-red-400 bg-red-50/30' : 'border-stone-200'
                }`}
              >
                <option value="">-- Choose a Service --</option>
                <option value="general-consult">Comprehensive Doctor Skin & Hair Consultation</option>
                {TREATMENTS_DATA.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (₹{t.price.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
              {errors.serviceId && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.serviceId}</span>
                </p>
              )}
            </div>

            {/* Date and Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Date */}
              <div>
                <label htmlFor="bookingDate" className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                  Preferred Date <span className="text-amber-800">*</span>
                </label>
                <div className="relative">
                  <input
                    id="bookingDate"
                    type="date"
                    min={todayStr}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full px-4 py-3 text-sm rounded-xl border bg-stone-50/50 text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-900/20 transition-all ${
                      errors.date ? 'border-red-400 bg-red-50/30' : 'border-stone-200'
                    }`}
                  />
                  <Calendar className="absolute right-3.5 top-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
                </div>
                {errors.date && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.date}</span>
                  </p>
                )}
              </div>

              {/* Time Slot */}
              <div>
                <label htmlFor="timeSlot" className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                  Preferred Time Slot <span className="text-amber-800">*</span>
                </label>
                <div className="relative">
                  <select
                    id="timeSlot"
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-900/20 transition-all"
                  >
                    <option value="Morning (10:00 AM – 01:00 PM)">Morning (10:00 AM – 01:00 PM)</option>
                    <option value="Afternoon (02:00 PM – 05:00 PM)">Afternoon (02:00 PM – 05:00 PM)</option>
                    <option value="Evening (05:00 PM – 08:00 PM)">Evening (05:00 PM – 08:00 PM)</option>
                  </select>
                  <Clock className="absolute right-3.5 top-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Promo Code & Note */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="promoCode" className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                  Promo / Referral Code
                </label>
                <div className="relative">
                  <input
                    id="promoCode"
                    type="text"
                    value={formData.promoCode}
                    onChange={(e) => setFormData({ ...formData, promoCode: e.target.value.toUpperCase() })}
                    placeholder="e.g. VEDAGLOW25"
                    className="w-full px-4 py-3 text-sm font-mono tracking-wider uppercase rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-900/20 transition-all"
                  />
                  <Tag className="absolute right-3.5 top-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                  Specific Skin or Hair Concern
                </label>
                <input
                  id="notes"
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Melasma, acne scars, hair thinning"
                  className="w-full px-4 py-3 text-sm rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-900/20 transition-all"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white font-semibold text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5 text-amber-300" />
                <span>Confirm Consultation Request</span>
              </button>
              <p className="text-[11px] text-stone-500 text-center mt-2.5">
                No upfront payment required. Our medical coordinator will call or WhatsApp within 2 operational hours to confirm your slot.
              </p>
            </div>

          </form>
        </div>

      </div>

      {/* Confirmation Modal */}
      {submittedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-700">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900">
                Appointment Requested!
              </h3>
              <p className="text-xs sm:text-sm text-stone-600">
                Thank you, <strong className="text-stone-900">{submittedBooking.fullName}</strong>. Your consultation has been logged with reference:
              </p>
              <div className="inline-block px-3 py-1 bg-stone-100 rounded-md font-mono text-amber-900 font-semibold text-sm">
                {submittedBooking.id}
              </div>
            </div>

            {/* Summary card */}
            <div className="bg-stone-50 rounded-2xl p-4 text-xs space-y-2 border border-stone-200/70">
              <div className="flex justify-between py-1 border-b border-stone-200/50">
                <span className="text-stone-500">Service:</span>
                <span className="font-medium text-stone-900">{submittedBooking.serviceName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200/50">
                <span className="text-stone-500">Date & Slot:</span>
                <span className="font-medium text-stone-900">{submittedBooking.date} ({submittedBooking.timeSlot})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200/50">
                <span className="text-stone-500">Contact:</span>
                <span className="font-medium text-stone-900">{submittedBooking.phone}</span>
              </div>
              {submittedBooking.promoCode && (
                <div className="flex justify-between py-1 border-b border-stone-200/50">
                  <span className="text-stone-500">Applied Promo:</span>
                  <span className="font-semibold text-emerald-700">{submittedBooking.promoCode} (25% Privilege)</span>
                </div>
              )}
              <div className="flex justify-between py-1">
                <span className="text-stone-500">Clinic Location:</span>
                <span className="font-medium text-stone-900">100 Ft Rd, Indiranagar, Bengaluru</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <a
                href={`https://wa.me/919845012845?text=Hello%20Veda%20Clinic,%20I%20have%20submitted%20appointment%20request%20${submittedBooking.id}%20for%20${encodeURIComponent(submittedBooking.serviceName)}%20on%20${submittedBooking.date}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Confirm Instant on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setSubmittedBooking(null)}
                className="w-full py-2.5 px-4 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
