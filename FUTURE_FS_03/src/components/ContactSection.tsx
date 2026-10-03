import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Navigation, MessageSquare, ExternalLink } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [isOpenNow, setIsOpenNow] = useState<boolean>(true);

  useEffect(() => {
    // Check if open in IST (UTC+5:30)
    const checkOpenStatus = () => {
      const now = new Date();
      // IST offset: 330 minutes
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const istDate = new Date(utc + 3600000 * 5.5);
      const day = istDate.getDay(); // 0 is Sun
      const hour = istDate.getHours();

      if (day === 0) {
        // Sunday: 10am to 5pm (17:00)
        setIsOpenNow(hour >= 10 && hour < 17);
      } else {
        // Mon-Sat: 10am to 8pm (20:00)
        setIsOpenNow(hour >= 10 && hour < 20);
      }
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=100+Feet+Road+Indiranagar+Bengaluru+560038';

  return (
    <section id="contact" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl mb-16 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900">
          <span>Find & Visit Us</span>
          <span aria-hidden="true">·</span>
          <span>Central Bengaluru</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 text-balance">
          Visiting Our Indiranagar Clinic.
        </h2>
        <p className="text-stone-600 text-base sm:text-lg">
          Conveniently located on 100 Feet Road with dedicated valet parking and quiet, private clinical reception.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* Contact Info Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-8">
          
          <div className="space-y-6">
            {/* Live Open Status Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Clinic Status</span>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isOpenNow ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
                <span className={`text-xs font-semibold ${isOpenNow ? 'text-emerald-800' : 'text-stone-600'}`}>
                  {isOpenNow ? 'Open Now (Welcoming Patients)' : 'Closed Now (Opens 10:00 AM IST)'}
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-200/60">
                <MapPin className="w-5 h-5 text-amber-900" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-stone-900 text-sm">Clinic Address</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Plot No. 742, 2nd Floor, 100 Feet Road,<br />
                  Indiranagar, Bengaluru, Karnataka 560038, India
                </p>
                <p className="text-xs text-stone-400">
                  Landmark: Diagonally opposite Starbucks, above Fabindia.
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-200/60">
                <Phone className="w-5 h-5 text-amber-900" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-stone-900 text-sm">Direct Clinical Line</h3>
                <a
                  href="tel:+919845012845"
                  className="text-sm text-stone-900 font-medium hover:text-amber-900 transition-colors block"
                >
                  +91 98450 12845
                </a>
                <span className="text-xs text-stone-400">Reception Desk: 080-4501-2845</span>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-200/60">
                <Mail className="w-5 h-5 text-amber-900" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-stone-900 text-sm">Email Inquiries</h3>
                <a
                  href="mailto:care@vedaaesthetic.in"
                  className="text-sm text-stone-900 font-medium hover:text-amber-900 transition-colors block"
                >
                  care@vedaaesthetic.in
                </a>
                <span className="text-xs text-stone-400">For corporate & doctor referrals</span>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-200/60">
                <Clock className="w-5 h-5 text-amber-900" />
              </div>
              <div className="space-y-1 w-full text-xs">
                <h3 className="font-semibold text-stone-900 text-sm">Consultation Hours</h3>
                <div className="flex justify-between text-stone-600 pt-1">
                  <span>Monday – Saturday:</span>
                  <span className="font-medium text-stone-900">10:00 AM – 08:00 PM</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Sunday:</span>
                  <span className="font-medium text-stone-900">10:00 AM – 05:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row gap-3">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs sm:text-sm transition-colors shadow-xs"
            >
              <Navigation className="w-4 h-4 text-amber-300" />
              <span>Get Directions</span>
            </a>

            <a
              href="https://wa.me/919845012845?text=Hello%20Veda%20Clinic,%20I%20would%20like%20to%20visit%20today."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm transition-colors shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>

        </div>

        {/* Map & Facility Overview Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl font-normal text-stone-900">
                Interactive Location & Parking Guide
              </h3>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-amber-900 font-semibold flex items-center gap-1 hover:underline"
              >
                <span>View Full Map</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="text-xs sm:text-sm text-stone-500">
              Complimentary valet attendants are stationed at the ground-level foyer directly on 100 Feet Road.
            </p>
          </div>

          {/* Styled Google Maps iframe representation with interactive fallback */}
          <div className="relative rounded-2xl overflow-hidden aspect-16/9 bg-stone-100 border border-stone-200 shadow-inner">
            <iframe
              title="Veda Aesthetic Clinic Location"
              src="https://maps.google.com/maps?q=100+Feet+Road+Indiranagar+Bengaluru+560038&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full filter saturate-90 contrast-105"
            />
          </div>

          {/* Quick Transit & Arrival Advice */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs text-stone-600">
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/60">
              <strong className="block text-stone-900 font-medium mb-0.5">By Namma Metro</strong>
              Indiranagar Metro Station (Purple Line) is 650m away (8 min walk).
            </div>
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/60">
              <strong className="block text-stone-900 font-medium mb-0.5">Valet Parking</strong>
              Drop keys with our liveried attendants at Plot 742 entrance.
            </div>
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/60">
              <strong className="block text-stone-900 font-medium mb-0.5">Accessibility</strong>
              Elevator access directly to 2nd Floor clinical suites. Wheelchair ready.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
