import React, { useState } from 'react';
import { Layers, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, KeyRound, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

interface LoginProps {
  onNavigate: (page: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasCopiedCreds, setHasCopiedCreds] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please provide both email address and password.');
      return;
    }

    const success = await login(email.trim(), password);
    if (success) {
      onNavigate('dashboard');
    } else {
      setErrorMessage('Invalid credentials. Check your email or password and try again.');
    }
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@leadpulse.com');
    setPassword('Admin@123456');
    setErrorMessage('');
    setHasCopiedCreds(true);
    setTimeout(() => setHasCopiedCreds(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo */}
        <div
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 cursor-pointer group mb-2"
        >
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl text-slate-900 tracking-tight">
            LeadPulse<span className="text-indigo-600">.crm</span>
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Admin Portal Sign In
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Enter your administrative credentials to access the CRM lead dashboard.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl border border-slate-200/90 rounded-3xl sm:px-10">
          {/* Quick Demo Autofill Notice */}
          <div className="mb-6 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-bold text-indigo-950">Project Evaluator Quick Access</p>
                <p className="text-[11px] text-indigo-700/80 mt-0.5">
                  Click below to autofill the pre-seeded admin account credentials:
                </p>
                <button
                  type="button"
                  onClick={handleFillDemoAdmin}
                  className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {hasCopiedCreds ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Filled Credentials!
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-3.5 h-3.5" />
                      Autofill Demo Admin
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@leadpulse.com"
                  required
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">Encrypted with Bcrypt</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
              </div>
            </div>

            {/* Sign in button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating JWT Session...
                  </>
                ) : (
                  <>
                    Sign In to Dashboard <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              &larr; Back to Website
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Submit Contact Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
