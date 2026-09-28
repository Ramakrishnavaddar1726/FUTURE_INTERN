import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Users,
  Clock,
  Sparkles,
  MessageSquare,
  Building2,
  Mail,
  Phone,
  Briefcase,
  AlertCircle,
  Database,
  Calendar,
  BarChart3,
  Activity,
  Layers,
  Lock,
  Filter,
} from 'lucide-react';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.js';
import {
  SUPABASE_PROJECT_ID,
  directSupabaseAppointmentBooking,
} from '../services/supabaseClient.js';

interface HomeProps {
  onNavigate: (page: string) => void;
}

const SERVICES = [
  'Enterprise Cloud Migration',
  'Custom CRM & Analytics Suite',
  'Supply Chain Integration',
  'HIPAA Compliant Web Portal',
  'White-Label SaaS Platform',
  'Lead Pipeline Automation',
  'General Inquiry',
];

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { showToast } = useToast();

  // Interactive Solution & Feature tabs state
  const [activeSolutionTab, setActiveSolutionTab] = useState<'consulting' | 'healthcare' | 'saas' | 'legal'>('consulting');
  const [activeFeatureFilter, setActiveFeatureFilter] = useState<'all' | 'sync' | 'pipeline' | 'analytics'>('all');

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: SERVICES[0],
    message: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Valid corporate or personal email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address';
    }
    if (!formData.phone.trim()) errs.phone = 'Contact telephone is required';
    if (!formData.message.trim()) errs.message = 'Please provide project details or your inquiry message';

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await api.leads.create({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        company: formData.company.trim() || 'Independent',
        service: formData.service,
        message: formData.message.trim(),
        source: 'Website Contact Form',
        status: 'New',
        priority: 'Medium',
      });

      if (res.success && res.data) {
        const primaryId = (res as any).supabase?.primaryId || res.data._id || res.data.id;
        setSubmittedLeadId(primaryId);
        showToast('Inquiry recorded & synchronized to Supabase database!', 'success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          service: SERVICES[0],
          message: '',
        });
        setFormErrors({});
      }
    } catch (err) {
      // Fallback: direct Supabase insert if backend API is unreachable
      try {
        const directResult = await directSupabaseAppointmentBooking({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          service: formData.service,
          message: formData.message,
        });
        const recId = directResult.leads?.[0]?.id || `lead_${Date.now()}`;
        setSubmittedLeadId(recId);
        showToast('Inquiry stored in Supabase database!', 'success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          service: SERVICES[0],
          message: '',
        });
        setFormErrors({});
      } catch (fallbackErr) {
        showToast((err as Error).message || 'Failed to submit inquiry', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900/5 via-transparent to-transparent pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Next-Generation CRM & Lead Ingestion Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Convert Website Inquiries into High-Value Deals{' '}
                <span className="text-indigo-600 underline decoration-indigo-200 decoration-wavy decoration-2">
                  3x Faster.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                LeadPulse bridges your client contact forms with an authenticated sales command center.
                Track new prospects in real-time, schedule high-touch follow-ups, and convert leads with automated
                pipeline analytics.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#contact-form"
                  className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  Send Client Inquiry <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  View Admin CRM Demo
                </button>
              </div>

              {/* Social Proof Badges */}
              <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Real-time DB Sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Encrypted JWT & Passwords</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>MongoDB Atlas Compatible</span>
                </div>
              </div>
            </div>

            {/* Right Interactive CRM Preview Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Glow backdrop */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur-xl opacity-20" />

                <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Live Pipeline Ingestion
                      </span>
                      <h3 className="text-base font-bold text-slate-900">Incoming Contact Inquiries</h3>
                    </div>
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Stream
                    </span>
                  </div>

                  {/* Simulated Lead Stream items */}
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                          RK
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Ravi Kumar</p>
                          <p className="text-[11px] text-slate-500">ABC Technologies &bull; Enterprise Cloud</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        Status: New
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                          ER
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Elena Rostova</p>
                          <p className="text-[11px] text-slate-500">Nova Financial &bull; Custom CRM Suite</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        Contacted
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                          MV
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Marcus Vance</p>
                          <p className="text-[11px] text-slate-500">Apex Freight &bull; Supply Chain</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Converted
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Average First-Response: &lt; 4 mins</span>
                    <button
                      onClick={() => onNavigate('dashboard')}
                      className="font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      Open CRM Portal &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="bg-slate-900 text-white py-12 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-indigo-400">99.4%</div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">
                Lead Delivery SLA
              </p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-indigo-400">&lt; 5 min</div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">
                Follow-Up Time
              </p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-indigo-400">+42%</div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">
                Conversion Boost
              </p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-indigo-400">100%</div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">
                REST API Integration
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM FEATURES */}
      <section id="features" className="py-20 bg-white scroll-mt-16 sm:scroll-mt-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-200">
              Platform Features & Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Engineered for Complete Pipeline Visibility
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-normal">
              From the instant a client books an appointment to closed-won revenue, every interaction is synchronized
              across your CRM and Supabase cloud database.
            </p>

            {/* Feature Category Filter Tabs */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
              {[
                { id: 'all', label: 'All Platform Capabilities' },
                { id: 'sync', label: 'Supabase Cloud Sync' },
                { id: 'pipeline', label: 'Pipeline Automation' },
                { id: 'analytics', label: 'Visual Analytics' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFeatureFilter(tab.id as any)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeFeatureFilter === tab.id
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Automated Ingestion */}
            {(activeFeatureFilter === 'all' || activeFeatureFilter === 'sync') && (
              <div className="bg-slate-50/80 rounded-3xl p-7 border border-slate-200/80 hover:shadow-xl hover:border-indigo-200 transition-all group relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md shadow-indigo-600/20">
                    <Database className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-bold text-slate-900">Instant Supabase Cloud Sync</h3>
                    <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Live
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Client appointments and contact submissions immediately synchronize with your Supabase PostgreSQL
                    database (<code className="font-mono text-indigo-700">{SUPABASE_PROJECT_ID}</code>) without polling or delay.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Target: appointments &amp; leads tables</span>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('contact-form');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    Test Live &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* Feature 2: Smart Follow-Up Engine */}
            {(activeFeatureFilter === 'all' || activeFeatureFilter === 'pipeline') && (
              <div className="bg-slate-50/80 rounded-3xl p-7 border border-slate-200/80 hover:shadow-xl hover:border-indigo-200 transition-all group relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md shadow-blue-600/20">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-bold text-slate-900">Smart Follow-Up Task Engine</h3>
                    <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      SLA Driven
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Set granular scheduled follow-up dates, define priority tiers (High, Medium, Low), and flag overdue
                    prospects so warm opportunities never go cold.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Sub-15 min first response SLA</span>
                  <button
                    type="button"
                    onClick={() => onNavigate('dashboard')}
                    className="font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    View Queue &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* Feature 3: Visual Analytics */}
            {(activeFeatureFilter === 'all' || activeFeatureFilter === 'analytics') && (
              <div className="bg-slate-50/80 rounded-3xl p-7 border border-slate-200/80 hover:shadow-xl hover:border-indigo-200 transition-all group relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md shadow-emerald-600/20">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-bold text-slate-900">Dynamic Recharts Analytics</h3>
                    <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Real-Time
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Live pipeline conversion rates, status distributions, 30-day timeline projections, and high-priority
                    workload distribution rendered via responsive SVG charts.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Auto-computed conversion %</span>
                  <button
                    type="button"
                    onClick={() => onNavigate('dashboard')}
                    className="font-bold text-emerald-600 hover:text-emerald-800 cursor-pointer"
                  >
                    See Metrics &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* Feature 4: Role-Based Auth */}
            {(activeFeatureFilter === 'all' || activeFeatureFilter === 'sync') && (
              <div className="bg-slate-50/80 rounded-3xl p-7 border border-slate-200/80 hover:shadow-xl hover:border-indigo-200 transition-all group relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md shadow-purple-600/20">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-bold text-slate-900">JWT &amp; Bcrypt Security</h3>
                    <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                      Protected
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Role-based access control with HTTP-bearer JWT authorization tokens and 10-round Bcrypt password
                    hashing to ensure enterprise data compliance.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Protected /api/leads endpoints</span>
                  <button
                    type="button"
                    onClick={() => onNavigate('login')}
                    className="font-bold text-purple-600 hover:text-purple-800 cursor-pointer"
                  >
                    Admin Auth &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* Feature 5: Communication Audit Logs */}
            {(activeFeatureFilter === 'all' || activeFeatureFilter === 'pipeline') && (
              <div className="bg-slate-50/80 rounded-3xl p-7 border border-slate-200/80 hover:shadow-xl hover:border-indigo-200 transition-all group relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md shadow-amber-500/20">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-bold text-slate-900">Timestamped Activity Notes</h3>
                    <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      Audit Trail
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Sales reps can log meeting debriefs, customer budget notes, and call summaries directly into the
                    lead thread with automatic date and author stamping.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Persistent CRM communication logs</span>
                  <button
                    type="button"
                    onClick={() => onNavigate('dashboard')}
                    className="font-bold text-amber-600 hover:text-amber-800 cursor-pointer"
                  >
                    Inspect Notes &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* Feature 6: One-Click Status Progression */}
            {(activeFeatureFilter === 'all' || activeFeatureFilter === 'analytics') && (
              <div className="bg-slate-50/80 rounded-3xl p-7 border border-slate-200/80 hover:shadow-xl hover:border-indigo-200 transition-all group relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md shadow-teal-600/20">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-bold text-slate-900">1-Click Pipeline Progression</h3>
                    <span className="text-[10px] font-mono font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                      Kanban Ready
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Transition prospect status seamlessly from <strong>New</strong> to <strong>Contacted</strong> to{' '}
                    <strong>Converted</strong> with instant toast feedback and metrics updating in real time.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Zero-latency database mutations</span>
                  <button
                    type="button"
                    onClick={() => onNavigate('dashboard')}
                    className="font-bold text-teal-600 hover:text-teal-800 cursor-pointer"
                  >
                    Try Pipeline &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* INDUSTRY SOLUTIONS SECTION */}
      <section id="solutions" className="py-20 bg-slate-50 border-t border-slate-200/80 scroll-mt-16 sm:scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-200">
              Tailored Industry Solutions
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Pre-Configured Pipelines for High-Velocity Sectors
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-normal">
              Whether you book executive consultations, medical patient evaluations, or software demos, LeadPulse
              adapts to your organizational sales workflows.
            </p>

            {/* Solution Industry Tabs */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
              {[
                { id: 'consulting', label: '💼 Enterprise Consulting', role: 'Advisory & IT Services' },
                { id: 'healthcare', label: '🏥 Healthcare & Clinics', role: 'HIPAA Patient Intake' },
                { id: 'saas', label: '🚀 B2B Tech & SaaS', role: 'Demo Ingestion & Product Trials' },
                { id: 'legal', label: '⚖️ Legal & Finance', role: 'High-Touch Retainer Deals' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSolutionTab(tab.id as any)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
                    activeSolutionTab === tab.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Industry Solution Card & Workflow */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Solution Focus Details */}
            <div className="lg:col-span-6 space-y-6">
              {activeSolutionTab === 'consulting' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Management Consulting &amp; Cloud Architecture</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    Qualify Strategic Inquiries &amp; Schedule Discovery Calls in Under 10 Minutes
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Stop letting multi-thousand dollar proposals slip away. Automatically route client requirements to
                    engagement partners while logging records directly into Supabase.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Direct calendar date &amp; time slot picker synced to appointment tables</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Company size and service selection attribution for immediate qualification</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Full discovery note history to prep principals before client kickoff</span>
                    </li>
                  </ul>
                </div>
              )}

              {activeSolutionTab === 'healthcare' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Healthcare Practices &amp; Clinical Portals</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    Confidential Patient Intake with Secure Appointment Reservation
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Enable prospective patients or clinical partners to request evaluation slots. Securely structured
                    for sensitive intake validation with encrypted admin credentials.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Zero cleartext exposure with Bcrypt encryption and role-gated access</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Instant time-stamped appointment booking entries in PostgreSQL</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Urgent SLA tagging for emergency follow-up and priority escalations</span>
                    </li>
                  </ul>
                </div>
              )}

              {activeSolutionTab === 'saas' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                    <Zap className="w-3.5 h-3.5 text-blue-600" />
                    <span>B2B Software &amp; Developer Tooling</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    Convert High-Intent Website Traffic into Scheduled Product Demos
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Reduce sales cycle friction. Ingest inbound leads from landing pages, assign SDR accounts, and
                    measure funnel velocity across your analytics dashboard.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Real-time webhook and REST API compatibility for marketing forms</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Conversion funnel charts showing drop-off and conversion speed</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>PostgreSQL schema export ready for enterprise database warehouses</span>
                    </li>
                  </ul>
                </div>
              )}

              {activeSolutionTab === 'legal' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                    <Lock className="w-3.5 h-3.5 text-purple-600" />
                    <span>Legal Retainers &amp; Wealth Advisory</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    High-Touch Client Relationship Tracking with Complete Audit Logs
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Manage high-net-worth client acquisition with discreteness, documented interaction logs, and
                    punctual calendar follow-ups.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Chronological communication threads with author authentication</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Status audit history ensuring compliance and timely case review</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Private cloud hosting topology supported on Supabase and MongoDB</span>
                    </li>
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('contact-form');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  Schedule Solution Consultation <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  Explore CRM Workspace
                </button>
              </div>
            </div>

            {/* Right: Architecture & Ingestion Flow Diagram */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">Live End-to-End Pipeline Stream</h3>
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Supabase Connected
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {/* Step 1 */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                        1
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block">Client Books Appointment</span>
                        <span className="text-[11px] text-slate-500">Visitor inputs date, slot &amp; contact info</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-indigo-700 font-mono font-semibold">Web UI</span>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                        2
                      </div>
                      <div>
                        <span className="font-bold text-indigo-950 block">Dual Database Synchronization</span>
                        <span className="text-[11px] text-indigo-700">Writes to CRM &amp; Supabase tables</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-blue-700 font-mono font-bold">200 OK</span>
                  </div>

                  {/* Step 3 */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                        3
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block">Admin Command Center Alert</span>
                        <span className="text-[11px] text-slate-500">Lead assigned with High Priority status</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold font-mono">Real-Time</span>
                  </div>

                  {/* Step 4 */}
                  <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                        4
                      </div>
                      <div>
                        <span className="font-bold text-purple-950 block">Discovery Call &rarr; Converted Deal</span>
                        <span className="text-[11px] text-purple-700">Timestamped notes &amp; revenue pipeline win</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-purple-800 font-bold font-mono">Revenue Won</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PUBLIC CONTACT / LEAD GENERATION FORM */}
      <section id="contact-form" className="py-20 bg-white border-t border-slate-200 scroll-mt-16 sm:scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Get In Touch
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Submit a Client Inquiry
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              Fill out the form below to test the live lead generation pipeline.
              Submissions are stored directly in the database and immediately appear on the Admin CRM Dashboard!
            </p>
          </div>

          {submittedLeadId ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-950">Inquiry Received Successfully!</h3>
              <p className="text-sm text-emerald-800 max-w-md mx-auto">
                Thank you for contacting us. Your lead record has been assigned Lead ID{' '}
                <code className="font-mono bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold">
                  {submittedLeadId}
                </code>{' '}
                and is now live in the administrator pipeline.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setSubmittedLeadId(null)}
                  className="px-5 py-2.5 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  Open CRM to View This Lead &rarr;
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl">
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Alex Morgan"
                        className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all ${
                          formErrors.name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {formErrors.name && (
                      <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {formErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. alex@company.com"
                        className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all ${
                          formErrors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {formErrors.email && (
                      <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {formErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +1 (555) 234-5678"
                        className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all ${
                          formErrors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {formErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Company / Organization
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Apex Global Solutions"
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Service of Interest */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Service Interested In
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all appearance-none cursor-pointer"
                    >
                      {SERVICES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Message / Project Scope *
                  </label>
                  <div className="relative">
                    <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please share details about your current infrastructure, timeline, budget, or key objectives..."
                      className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all resize-none ${
                        formErrors.message ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  {formErrors.message && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.message}
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting to LeadPulse CRM...
                      </>
                    ) : (
                      <>
                        Send Inquiry &rarr;
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-slate-400 mt-3">
                    Submitting this form directly calls the Express backend API <code className="text-slate-600 font-mono">POST /api/leads</code> and creates a database record.
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
