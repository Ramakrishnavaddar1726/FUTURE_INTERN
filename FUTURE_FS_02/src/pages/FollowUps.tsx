import React, { useState, useEffect } from 'react';
import {
  CalendarClock,
  Plus,
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  Trash2,
  AlertCircle,
  X,
  ExternalLink,
} from 'lucide-react';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.js';
import { PriorityBadge } from '../components/PriorityBadge.js';
import { FollowUp, Lead, LeadPriority } from '../types/crm.js';

interface FollowUpsProps {
  onViewLead: (leadId: string) => void;
}

export const FollowUps: React.FC<FollowUpsProps> = ({ onViewLead }) => {
  const { showToast } = useToast();

  const [followups, setFollowups] = useState<FollowUp[]>([]);
  const [leadsList, setLeadsList] = useState<Lead[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pending' | 'Completed'>('Pending');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'High' | 'Medium' | 'Low'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // New follow-up modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLeadId, setNewLeadId] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<LeadPriority>('Medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchFollowUps = async () => {
    try {
      setIsLoading(true);
      const res = await api.followups.getAll({
        status: statusFilter,
      });
      if (res.success) {
        setFollowups(res.data);
      }
    } catch (e) {
      showToast('Failed to load follow-ups', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadLeadsForDropdown = async () => {
    try {
      const res = await api.leads.getAll({ limit: 100 });
      if (res.success) {
        setLeadsList(res.data);
        if (res.data.length > 0 && !newLeadId) {
          setNewLeadId(res.data[0]._id);
        }
      }
    } catch (e) {
      // quiet
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, [statusFilter]);

  useEffect(() => {
    loadLeadsForDropdown();
  }, []);

  const handleToggleComplete = async (id: string) => {
    try {
      const res = await api.followups.toggleComplete(id);
      if (res.success) {
        showToast(`Follow-up marked as ${res.data.status}`, 'success');
        setFollowups((prev) => prev.map((f) => (f._id === id ? res.data : f)));
      }
    } catch (e) {
      showToast('Failed to update follow-up', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await api.followups.delete(id);
      if (res.success) {
        showToast('Follow-up deleted', 'info');
        setFollowups((prev) => prev.filter((f) => f._id !== id));
      }
    } catch (e) {
      showToast('Failed to delete follow-up', 'error');
    }
  };

  const handleCreateFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadId || !newDate || !newDesc.trim()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const targetLead = leadsList.find((l) => l._id === newLeadId);
      const res = await api.followups.create(newLeadId, {
        date: newDate,
        time: newTime,
        description: newDesc.trim(),
        priority: newPriority,
        leadName: targetLead?.name || 'Client',
      });

      if (res.success) {
        showToast('Follow-up task scheduled successfully', 'success');
        setIsModalOpen(false);
        setNewDesc('');
        setNewDate('');
        fetchFollowUps();
      }
    } catch (e) {
      showToast('Failed to schedule follow-up', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFollowUps = followups.filter((f) => {
    if (priorityFilter !== 'all' && f.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Follow-Up Tasks & Reminders</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize scheduled client calls, proposal deadlines, and follow-through check-ins
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Schedule Follow-up
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5">
          {(['all', 'Pending', 'Completed'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'All Follow-ups' : st}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="py-1 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Follow-up list */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <span className="w-8 h-8 border-3 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin inline-block mb-3" />
            <p className="text-xs text-slate-400">Loading follow-ups...</p>
          </div>
        ) : filteredFollowUps.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
              <CalendarClock className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-800">No follow-ups found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {statusFilter === 'Pending'
                ? 'Great job! You have cleared all pending reminders.'
                : 'No tasks match the active filters.'}
            </p>
          </div>
        ) : (
          filteredFollowUps.map((item) => {
            const isCompleted = item.status === 'Completed';
            return (
              <div
                key={item._id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-slate-50/60 border-slate-200/60 opacity-75'
                    : 'bg-white border-slate-200/90 shadow-xs hover:border-indigo-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Complete Checkbox Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleComplete(item._id)}
                    className="mt-1 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                    title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400 hover:text-indigo-600" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`text-sm font-bold ${
                          isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {item.description}
                      </span>
                      <PriorityBadge priority={item.priority} />
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                      <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        {item.date} {item.time ? `at ${item.time}` : ''}
                      </span>

                      <button
                        type="button"
                        onClick={() => onViewLead(item.leadId)}
                        className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold hover:underline cursor-pointer"
                      >
                        Lead: {item.leadName || 'Client Profile'}
                        <ExternalLink className="w-3 h-3" />
                      </button>

                      <span>&bull;</span>
                      <span className="text-slate-400">Assigned by {item.createdBy}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Follow-up"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Schedule Follow-up Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Schedule Lead Follow-up</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFollowUp} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Target Client Lead *
                </label>
                <select
                  value={newLeadId}
                  onChange={(e) => setNewLeadId(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 cursor-pointer"
                >
                  {leadsList.map((lead) => (
                    <option key={lead._id} value={lead._id}>
                      {lead.name} ({lead.company})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="e.g. 02:30 PM"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Priority
                </label>
                <div className="flex gap-2">
                  {(['Low', 'Medium', 'High'] as LeadPriority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPriority(p)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        newPriority === p
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Follow-Up Description / Agenda *
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. Review updated proposal terms and set kickoff date with stakeholders..."
                  required
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Scheduling...' : 'Save Follow-up'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
