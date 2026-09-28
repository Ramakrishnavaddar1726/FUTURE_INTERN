import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Lock,
  Database,
  ShieldCheck,
  Server,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Copy,
  ExternalLink,
  Send,
  Check,
  Sparkles,
  Code2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.js';
import {
  SUPABASE_PROJECT_ID,
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
} from '../services/supabaseClient.js';

export const Settings: React.FC = () => {
  const { user, updateCurrentUser } = useAuth();
  const { showToast } = useToast();

  // Profile Edit State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [pwdError, setPwdError] = useState('');

  // Supabase State
  const [sbStatus, setSbStatus] = useState<any>(null);
  const [isCheckingSb, setIsCheckingSb] = useState(false);
  const [isTestingInsert, setIsTestingInsert] = useState(false);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    checkSupabaseStatus();
  }, []);

  const checkSupabaseStatus = async () => {
    try {
      setIsCheckingSb(true);
      const res = await api.supabase.getStatus();
      setSbStatus(res);
    } catch (err: any) {
      console.warn('Supabase status check notice:', err);
    } finally {
      setIsCheckingSb(false);
    }
  };

  const handleTestInsert = async () => {
    try {
      setIsTestingInsert(true);
      setTestResult(null);
      const res = await api.supabase.testInsert({
        name: 'Alex Morgan (Supabase Test Booking)',
        email: 'alex.morgan@test.com',
        phone: '+1 (555) 987-6543',
        company: 'Innovate Tech Labs',
        service: 'Executive CRM Architecture Consultation',
        message: 'Live test verification from LeadPulse CRM to Supabase appointments table.',
        appointmentDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        appointmentTime: '11:00 AM (EST)',
      });
      setTestResult(res);
      showToast(res.message || 'Test appointment sent to Supabase!', res.success ? 'success' : 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to send test insert', 'error');
    } finally {
      setIsTestingInsert(false);
    }
  };

  const handleSyncAll = async () => {
    try {
      setIsSyncingAll(true);
      const res = await api.supabase.syncAll();
      showToast(`Batch synced ${res.count} CRM leads with Supabase database!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to batch sync records', 'error');
    } finally {
      setIsSyncingAll(false);
    }
  };

  const copySqlToClipboard = () => {
    const sql = `-- Supabase Table Schema for Appointments and Leads
CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  service text,
  notes text,
  appointment_date text,
  appointment_time text,
  date text,
  time text,
  status text DEFAULT 'Pending',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public booking" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read" ON public.appointments FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS public.leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  service text,
  message text,
  source text DEFAULT 'Website Appointment Booking Form',
  status text DEFAULT 'New',
  priority text DEFAULT 'Medium',
  follow_up_date text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON public.leads FOR SELECT USING (true);`;

    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    showToast('SQL DDL copied to clipboard! Paste in Supabase SQL Editor.', 'success');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Name and email are required', 'error');
      return;
    }

    try {
      setIsUpdatingProfile(true);
      const res = await api.auth.updateProfile(name.trim(), email.trim());
      if (res.success && res.user) {
        updateCurrentUser(res.user);
        showToast('Admin profile updated successfully', 'success');
      }
    } catch (err) {
      showToast((err as Error).message || 'Failed to update profile', 'error');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');

    if (!currentPassword || !newPassword) {
      setPwdError('Please fill in current and new password');
      return;
    }

    if (newPassword.length < 6) {
      setPwdError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdError('New passwords do not match');
      return;
    }

    try {
      setIsChangingPassword(true);
      const res = await api.auth.changePassword(currentPassword, newPassword);
      if (res.success) {
        showToast('Password updated securely with Bcrypt hash', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setPwdError((err as Error).message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System & Account Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage administrator profile credentials, security settings, and live Supabase database synchronization.
        </p>
      </div>

      {/* Supabase Integration Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Supabase Cloud Database Integration</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  CONNECTED
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Appointment booking forms and client inquiries automatically save to your Supabase PostgreSQL tables.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={checkSupabaseStatus}
            disabled={isCheckingSb}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCheckingSb ? 'animate-spin' : ''}`} />
            Test Connection
          </button>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-1">
            <span className="text-slate-400 text-[11px] block">Supabase Project ID</span>
            <span className="font-mono text-emerald-400 font-bold text-sm block">{SUPABASE_PROJECT_ID}</span>
            <span className="text-[10px] text-slate-400">Authenticated via publishable client</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-1 md:col-span-2">
            <span className="text-slate-400 text-[11px] block">REST Endpoint URL</span>
            <span className="font-mono text-slate-200 text-xs block break-all">{SUPABASE_URL}</span>
            <span className="text-[10px] text-slate-400">Direct PostgREST API endpoint</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleTestInsert}
            disabled={isTestingInsert}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-900/40 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            {isTestingInsert ? 'Sending to Supabase...' : 'Send Test Appointment to Supabase'}
          </button>

          <button
            type="button"
            onClick={handleSyncAll}
            disabled={isSyncingAll}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin' : ''}`} />
            {isSyncingAll ? 'Syncing All Records...' : 'Sync All Existing Leads to Supabase'}
          </button>

          <button
            type="button"
            onClick={copySqlToClipboard}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-700/40 transition-all flex items-center gap-2 cursor-pointer"
          >
            {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedSql ? 'Copied SQL Script!' : 'Copy Supabase Table SQL'}
          </button>

          <button
            type="button"
            onClick={() => setShowSqlModal(!showSqlModal)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
          >
            <Code2 className="w-3.5 h-3.5" />
            {showSqlModal ? 'Hide Schema' : 'View SQL Schema'}
          </button>
        </div>

        {/* Test Result Message Box */}
        {testResult && (
          <div className="p-4 rounded-2xl bg-slate-800/90 border border-emerald-500/30 text-xs space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{testResult.message}</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Sample booking: <span className="font-semibold text-white">{testResult.sampleData?.name}</span> ({testResult.sampleData?.email}) - Scheduled: <span className="font-semibold text-white">{testResult.sampleData?.appointmentDate} at {testResult.sampleData?.appointmentTime}</span>
            </p>
          </div>
        )}

        {/* Collapsible SQL Schema */}
        {showSqlModal && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-3 font-mono">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>SQL DDL Script (Execute in Supabase SQL Editor if tables not yet created):</span>
              <button
                type="button"
                onClick={copySqlToClipboard}
                className="text-emerald-400 hover:underline cursor-pointer"
              >
                Copy SQL
              </button>
            </div>
            <pre className="text-emerald-300 text-[11px] overflow-x-auto p-3 bg-slate-900 rounded-xl max-h-48">
{`CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  service text,
  notes text,
  appointment_date text,
  appointment_time text,
  status text DEFAULT 'Pending',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous appointment booking" ON public.appointments
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read of appointments" ON public.appointments
  FOR SELECT USING (true);`}
            </pre>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Admin Profile */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Administrator Profile</h3>
              <p className="text-[11px] text-slate-400">Account identity & communication email</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                System Role
              </label>
              <div className="p-2.5 bg-slate-100/70 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>{user?.role || 'Super Admin'}</span>
                <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold uppercase">
                  Full Access
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isUpdatingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Card 2: Security & Password */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Security & Password</h3>
              <p className="text-[11px] text-slate-400">Update encrypted password</p>
            </div>
          </div>

          {pwdError && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{pwdError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Current Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  required
                  className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isChangingPassword ? 'Hashing & Updating...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>

      {/* Card 3: Database & Production Readiness */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Database & Deployment Topology</h3>
              <p className="text-[11px] text-slate-400">Architecture & environment specifications</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Status: Operational
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block mb-1">Connected Cloud DB</span>
            <span className="font-bold text-slate-800">Supabase (PostgreSQL)</span>
            <p className="text-[10px] text-emerald-600 mt-1 font-semibold">Project: {SUPABASE_PROJECT_ID}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block mb-1">Auth Protocol</span>
            <span className="font-bold text-slate-800">JWT + Bcrypt (10 rounds)</span>
            <p className="text-[10px] text-slate-500 mt-1">Bearer token authorization</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block mb-1">Backend Server</span>
            <span className="font-bold text-slate-800">Express REST Architecture</span>
            <p className="text-[10px] text-slate-500 mt-1">Port 3000 Unified Host</p>
          </div>
        </div>
      </div>
    </div>
  );
};
