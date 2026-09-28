import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Menu, ExternalLink, ShieldCheck, CheckCircle2, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { FollowUp } from '../types/crm.js';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onOpenMobileSidebar: () => void;
  onNavigate: (page: string) => void;
  onSelectLeadById?: (leadId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onOpenMobileSidebar,
  onNavigate,
  onSelectLeadById,
}) => {
  const { user } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [pendingFollowUps, setPendingFollowUps] = useState<FollowUp[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.followups.getAll({ status: 'Pending' });
        if (res.success && res.data) {
          setPendingFollowUps(res.data.slice(0, 5));
        }
      } catch (e) {
        // silent
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate(`leads?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & Page title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 lg:hidden cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {title}
            </h1>
            {subtitle && <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>}
          </div>
        </div>

        {/* Right side: Search, Notifications, Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search leads, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 lg:w-72 pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
            />
          </form>

          {/* Website Link */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50/60 px-3 py-1.5 rounded-xl border border-slate-200/70 transition-colors cursor-pointer"
            title="Preview Public Website Contact Form"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Notifications & Pending Follow-ups"
            >
              <Bell className="w-5 h-5" />
              {pendingFollowUps.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white animate-pulse" />
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Pending Reminders</span>
                  <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                    {pendingFollowUps.length} Pending
                  </span>
                </div>

                <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
                  {pendingFollowUps.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No pending follow-ups right now.
                    </div>
                  ) : (
                    pendingFollowUps.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => {
                          if (onSelectLeadById && item.leadId) {
                            onSelectLeadById(item.leadId);
                          } else {
                            onNavigate('followups');
                          }
                          setNotificationsOpen(false);
                        }}
                        className="p-3 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start gap-2">
                          <Calendar className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate">
                              {item.leadName || 'Lead Follow-up'}
                            </p>
                            <p className="text-[11px] text-slate-500 line-clamp-1">{item.description}</p>
                            <p className="text-[10px] text-indigo-600 font-medium mt-0.5">
                              Due: {item.date} {item.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 px-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate('followups');
                      setNotificationsOpen(false);
                    }}
                    className="w-full text-center text-xs font-bold text-indigo-600 hover:text-indigo-800 py-1 cursor-pointer"
                  >
                    View All Follow-ups &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Admin Avatar & Name */}
          <div
            onClick={() => onNavigate('settings')}
            className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs group-hover:bg-indigo-700 transition-colors">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-slate-800 block leading-none group-hover:text-indigo-600 transition-colors">
                {user?.name || 'Admin'}
              </span>
              <span className="text-[10px] text-slate-400 capitalize font-medium">
                {user?.role || 'Administrator'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
