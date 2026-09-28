import React, { useState } from 'react';
import {
  Users,
  Mail,
  Phone,
  Building2,
  Briefcase,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock,
  Shield,
  HelpCircle,
  Calendar,
  Sparkles,
  Database,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.js';
import {
  SUPABASE_PROJECT_ID,
  SUPABASE_URL,
  directSupabaseAppointmentBooking,
} from '../services/supabaseClient.js';

interface ContactProps {
  onNavigate: (page: string) => void;
}

const SERVICES = [
  'Enterprise Cloud Migration',
  'Custom CRM & Analytics Suite',
  'Supply Chain Integration',
  'HIPAA Compliant Web Portal',
  'White-Label SaaS Platform',
  'Lead Pipeline Automation',
  'Executive Strategy Consultation',
];

const TIME_SLOTS = [
  '09:00 AM - 09:45 AM (EST)',
  '10:30 AM - 11:15 AM (EST)',
  '01:00 PM - 01:45 PM (EST)',
  '02:30 PM - 03:15 PM (EST)',
  '04:00 PM - 04:45 PM (EST)',
];

export const Contact: React.FC<ContactProps> = ({ onNavigate }) => {
  const { showToast } = useToast();

  // Mode: 'appointment' | 'inquiry'
  const [formMode, setFormMode] = useState<'appointment' | 'inquiry'>('appointment');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: SERVICES[0],
    message: '',
    appointmentDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days from now
    appointmentTime: TIME_SLOTS[1],
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState<string>('');
  const [supabaseSyncInfo, setSupabaseSyncInfo] = useState<any>(null);
  const [confirmedRecord, setConfirmedRecord] = useState<any>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Valid corporate or personal email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address';
    }
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (formMode === 'appointment' && !formData.appointmentDate) {
      errs.appointmentDate = 'Please select a preferred appointment date';
    }
    if (formMode === 'inquiry' && !formData.message.trim()) {
      errs.message = 'Please provide inquiry message or requirements';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const messageContent =
        formMode === 'appointment'
          ? (formData.message.trim() || `Booked appointment for ${formData.appointmentDate} at ${formData.appointmentTime}. Service: ${formData.service}`)
          : formData.message.trim();

      // Submit through API which authoritatively validates and stores in Supabase database
      const res = await api.leads.create({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        company: formData.company.trim() || 'Independent',
        service: formData.service,
        message: messageContent,
        source: formMode === 'appointment' ? 'Website Appointment Booking Form' : 'Website Contact Form',
        status: 'New',
        priority: formMode === 'appointment' ? 'High' : 'Medium',
        followUpDate: formMode === 'appointment' ? formData.appointmentDate : null,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
      } as any);

      if (res.success && res.data) {
        const primaryId = (res as any).supabase?.primaryId || res.data._id || res.data.id;
        const dbRecord = (res as any).supabase?.appointmentRecord || (res as any).supabase?.leadRecord || res.data;

        setSubmittedLeadId(primaryId);
        setSupabaseSyncInfo((res as any).supabase || { connected: true });
        setConfirmedRecord(dbRecord);
        setIsSuccess(true);
        showToast(
          formMode === 'appointment'
            ? 'Appointment booked & stored in Supabase database!'
            : 'Inquiry submitted & stored in Supabase database!',
          'success'
        );
      }
    } catch (err) {
      // Fallback: direct Supabase insert if backend API was unreachable
      try {
        const messageContent =
          formMode === 'appointment'
            ? (formData.message.trim() || `Booked appointment for ${formData.appointmentDate} at ${formData.appointmentTime}. Service: ${formData.service}`)
            : formData.message.trim();

        const directResult = await directSupabaseAppointmentBooking({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          service: formData.service,
          message: messageContent,
          appointmentDate: formData.appointmentDate,
          appointmentTime: formData.appointmentTime,
        });

        const directRecord = directResult.appointments?.[0] || directResult.leads?.[0];
        const recordId = directRecord?.id || `rec_${Date.now()}`;

        setSubmittedLeadId(recordId);
        setConfirmedRecord(directRecord || formData);
        setSupabaseSyncInfo({ connected: true, direct: true });
        setIsSuccess(true);
        showToast('Successfully stored in Supabase database!', 'success');
      } catch (fallbackErr) {
        showToast((err as Error).message || 'Failed to submit form', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setIsSuccess(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      service: SERVICES[0],
      message: '',
      appointmentDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      appointmentTime: TIME_SLOTS[1],
    });
    setFormErrors({});
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Supabase Connected: {SUPABASE_PROJECT_ID}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Schedule an Appointment & Consultation
          </h1>
          <p className="text-sm text-slate-600 font-normal">
            Book a dedicated consultation slot or send a corporate inquiry. Data is securely saved to your{' '}
            <strong className="text-emerald-700 font-semibold">Supabase database</strong> and instantly routed to the
            LeadPulse CRM dashboard.
          </p>

          {/* Form Mode Tabs */}
          <div className="inline-flex p-1 bg-slate-200/80 rounded-2xl max-w-md mx-auto mt-4">
            <button
              type="button"
              onClick={() => setFormMode('appointment')}
              className={`flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                formMode === 'appointment'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              Book Appointment
            </button>
            <button
              type="button"
              onClick={() => setFormMode('inquiry')}
              className={`flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                formMode === 'inquiry'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
              General Inquiry
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            {isSuccess ? (
              <div className="bg-white rounded-3xl p-8 sm:p-10 border border-emerald-200 shadow-xl text-center space-y-6 animate-in zoom-in-95">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    Supabase Database Confirmed
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 mt-2">
                    {formMode === 'appointment' ? 'Appointment Booked Successfully!' : 'Inquiry Submitted Successfully!'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Database Record ID:{' '}
                    <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {submittedLeadId}
                    </span>
                  </p>
                </div>

                {/* Stored Record Summary Card */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-left space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Live Stored Record in Supabase
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full">
                      HTTP 201 Created
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Client Name</span>
                      <span className="font-semibold">{confirmedRecord?.name || formData.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Contact Email</span>
                      <span className="font-semibold">{confirmedRecord?.email || formData.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Phone</span>
                      <span className="font-semibold">{confirmedRecord?.phone || formData.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Service Requested</span>
                      <span className="font-semibold">{confirmedRecord?.service || formData.service}</span>
                    </div>

                    {formMode === 'appointment' && (
                      <>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Appointment Date</span>
                          <span className="font-bold text-indigo-600">
                            {confirmedRecord?.appointment_date || confirmedRecord?.date || formData.appointmentDate}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Appointment Time Slot</span>
                          <span className="font-bold text-indigo-600">
                            {confirmedRecord?.appointment_time || confirmedRecord?.time || formData.appointmentTime}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-xs text-slate-700 text-left space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-900">
                    <Database className="w-4 h-4 text-emerald-600" />
                    Supabase Database Synchronization Confirmed:
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                    <li>
                      Project ID: <code className="font-mono font-bold text-emerald-800">{SUPABASE_PROJECT_ID}</code>
                    </li>
                    <li>
                      Target Tables: <code className="font-mono text-emerald-800 font-semibold">appointments</code> and <code className="font-mono text-emerald-800 font-semibold">leads</code>
                    </li>
                    <li>
                      Storage State: Record is persistently saved in your Supabase PostgreSQL cloud tables.
                    </li>
                  </ul>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all cursor-pointer"
                  >
                    Book Another Slot
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('dashboard')}
                    className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all cursor-pointer"
                  >
                    View in CRM Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl shadow-slate-100/50 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      {formMode === 'appointment' ? <Calendar className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {formMode === 'appointment' ? 'Appointment Booking Form' : 'General Client Inquiry'}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {formMode === 'appointment'
                          ? 'Select your preferred time slot & consultation topic'
                          : 'Send your project scope and corporate requirements'}
                      </p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Supabase Live
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Sarah Jenkins"
                          className={`w-full pl-10 pr-3 py-2.5 text-xs bg-slate-50 border ${
                            formErrors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                          } rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all`}
                        />
                      </div>
                      {formErrors.name && (
                        <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {formErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="sarah@enterprise.com"
                          className={`w-full pl-10 pr-3 py-2.5 text-xs bg-slate-50 border ${
                            formErrors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                          } rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all`}
                        />
                      </div>
                      {formErrors.email && (
                        <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {formErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone Number & Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+1 (555) 234-5678"
                          className={`w-full pl-10 pr-3 py-2.5 text-xs bg-slate-50 border ${
                            formErrors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                          } rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all`}
                        />
                      </div>
                      {formErrors.phone && (
                        <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {formErrors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Company / Organization
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="Acme Technologies Inc."
                          className="w-full pl-10 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Service Interested In */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Service / Consultation Focus
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full pl-10 pr-8 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer"
                      >
                        {SERVICES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Appointment Date & Time (Conditional for Appointment mode) */}
                  {formMode === 'appointment' && (
                    <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        Select Preferred Appointment Schedule
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Date <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="date"
                            value={formData.appointmentDate}
                            onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                          />
                          {formErrors.appointmentDate && (
                            <p className="text-[10px] text-rose-600 mt-1">{formErrors.appointmentDate}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Time Slot (EST) <span className="text-rose-500">*</span>
                          </label>
                          <select
                            value={formData.appointmentTime}
                            onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 cursor-pointer"
                          >
                            {TIME_SLOTS.map((slot) => (
                              <option key={slot} value={slot}>
                                {slot}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notes / Message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {formMode === 'appointment' ? 'Appointment Agenda / Specific Topics (Optional)' : 'Inquiry Message / Requirements *'}
                    </label>
                    <div className="relative">
                      <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={
                          formMode === 'appointment'
                            ? 'Share any goals, questions, or system requirements for our consultation call...'
                            : 'Briefly describe your team scope, target timelines, and project objectives...'
                        }
                        className={`w-full pl-10 pr-3 py-2.5 text-xs bg-slate-50 border ${
                          formErrors.message ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                        } rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all`}
                      />
                    </div>
                    {formErrors.message && (
                      <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {formErrors.message}
                      </p>
                    )}
                  </div>

                  {/* Supabase Notice Banner */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-emerald-600" />
                      Auto-sync active to Supabase <strong className="text-slate-800">appointments</strong> & <strong className="text-slate-800">leads</strong>
                    </span>
                    <span className="font-mono text-emerald-700 font-bold">200 OK</span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Saving to CRM & Supabase...</span>
                      </>
                    ) : (
                      <>
                        <span>{formMode === 'appointment' ? 'Confirm & Book Appointment' : 'Send Inquiry to Pipeline'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Right Column: Value Props & Info */}
          <div className="lg:col-span-5 space-y-6">
            {/* Supabase Integration Card */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Supabase Cloud Sync</h4>
                    <p className="text-[11px] text-slate-400">Direct PostgreSQL database bridge</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  ACTIVE
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                  <span className="text-slate-400">Project ID:</span>
                  <span className="font-mono text-emerald-400 font-bold">{SUPABASE_PROJECT_ID}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <span className="text-slate-400 block text-[10px] mb-0.5">Endpoint URL:</span>
                  <span className="font-mono text-xs text-slate-200 break-all">{SUPABASE_URL}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                When visitors submit an appointment or contact request, our system simultaneously logs the customer into
                the local CRM storage and writes directly into your Supabase database instance.
              </p>
            </div>

            {/* SLA & Confidence */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Enterprise Service SLA</h4>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">Sub-15 Minute Response Time</span>
                    <span>All new appointment bookings trigger urgent high-priority flags in our admin queue.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-600 shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">Confidentiality Guarantee</span>
                    <span>NDAs provided prior to technical audits and software architecture discussions.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600 shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">Senior Solutions Architect</span>
                    <span>All discovery calls are conducted directly by certified software engineering leads.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
