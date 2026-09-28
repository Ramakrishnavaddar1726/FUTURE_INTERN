import React, { useState, useEffect } from 'react';
import { Lead, Note, FollowUp, LeadStatus, LeadPriority } from '../types/crm.js';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.js';
import { StatusBadge } from './StatusBadge.js';
import { PriorityBadge } from './PriorityBadge.js';
import {
  X,
  Mail,
  Phone,
  Building2,
  Calendar,
  Clock,
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Circle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface LeadDetailsDrawerProps {
  leadId: string | null;
  onClose: () => void;
  onLeadUpdated: () => void;
  onEditLead: (lead: Lead) => void;
}

export const LeadDetailsDrawer: React.FC<LeadDetailsDrawerProps> = ({
  leadId,
  onClose,
  onLeadUpdated,
  onEditLead,
}) => {
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'followups'>('overview');

  // Note form state
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editNoteContent, setEditNoteContent] = useState('');

  // Follow-up form state
  const [isAddingFollowUp, setIsAddingFollowUp] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpTime, setFollowUpTime] = useState('10:00 AM');
  const [followUpDesc, setFollowUpDesc] = useState('');
  const [followUpPriority, setFollowUpPriority] = useState<LeadPriority>('Medium');
  const [isSubmittingFollowUp, setIsSubmittingFollowUp] = useState(false);

  const { showToast } = useToast();

  const loadLeadDetails = async () => {
    if (!leadId) return;
    try {
      setIsLoading(true);
      const res = await api.leads.getById(leadId);
      if (res.success && res.data) {
        setLead(res.data);
      }
    } catch (err) {
      showToast('Failed to load lead details', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (leadId) {
      loadLeadDetails();
    } else {
      setLead(null);
    }
  }, [leadId]);

  if (!leadId) return null;

  // Status Change handler
  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!lead) return;
    try {
      const res = await api.leads.updateStatus(lead._id, newStatus);
      if (res.success) {
        setLead({ ...lead, status: newStatus, lastContactedAt: new Date().toISOString() });
        showToast(`Status updated to ${newStatus}`, 'success');
        onLeadUpdated();
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  // Note Handlers
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead || !newNoteContent.trim()) return;

    try {
      setIsAddingNote(true);
      const res = await api.notes.create(lead._id, newNoteContent.trim());
      if (res.success && res.data) {
        setLead({
          ...lead,
          notes: [res.data, ...(lead.notes || [])],
        });
        setNewNoteContent('');
        showToast('Note added successfully', 'success');
        onLeadUpdated();
      }
    } catch (err) {
      showToast('Failed to save note', 'error');
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleUpdateNote = async (noteId: string) => {
    if (!lead || !editNoteContent.trim()) return;
    try {
      const res = await api.notes.update(noteId, editNoteContent.trim());
      if (res.success) {
        setLead({
          ...lead,
          notes: (lead.notes || []).map((n) => (n._id === noteId ? { ...n, content: editNoteContent } : n)),
        });
        setEditingNoteId(null);
        showToast('Note updated', 'success');
      }
    } catch (err) {
      showToast('Failed to update note', 'error');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!lead) return;
    try {
      const res = await api.notes.delete(noteId);
      if (res.success) {
        setLead({
          ...lead,
          notes: (lead.notes || []).filter((n) => n._id !== noteId),
        });
        showToast('Note deleted', 'info');
      }
    } catch (err) {
      showToast('Failed to delete note', 'error');
    }
  };

  // Follow-up Handlers
  const handleAddFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead || !followUpDate || !followUpDesc.trim()) {
      showToast('Date and description are required for follow-up', 'error');
      return;
    }

    try {
      setIsSubmittingFollowUp(true);
      const res = await api.followups.create(lead._id, {
        date: followUpDate,
        time: followUpTime,
        description: followUpDesc.trim(),
        priority: followUpPriority,
        leadName: lead.name,
      });

      if (res.success && res.data) {
        setLead({
          ...lead,
          followUpDate: followUpDate,
          followups: [...(lead.followups || []), res.data],
        });
        setFollowUpDesc('');
        setFollowUpDate('');
        setIsAddingFollowUp(false);
        showToast('Follow-up scheduled successfully', 'success');
        onLeadUpdated();
      }
    } catch (err) {
      showToast('Failed to schedule follow-up', 'error');
    } finally {
      setIsSubmittingFollowUp(false);
    }
  };

  const handleToggleFollowUp = async (followUpId: string) => {
    if (!lead) return;
    try {
      const res = await api.followups.toggleComplete(followUpId);
      if (res.success && res.data) {
        setLead({
          ...lead,
          followups: (lead.followups || []).map((f) => (f._id === followUpId ? res.data : f)),
        });
        showToast(`Follow-up marked as ${res.data.status}`, 'success');
        onLeadUpdated();
      }
    } catch (err) {
      showToast('Failed to update follow-up', 'error');
    }
  };

  const handleDeleteFollowUp = async (followUpId: string) => {
    if (!lead) return;
    try {
      const res = await api.followups.delete(followUpId);
      if (res.success) {
        setLead({
          ...lead,
          followups: (lead.followups || []).filter((f) => f._id !== followUpId),
        });
        showToast('Follow-up deleted', 'info');
        onLeadUpdated();
      }
    } catch (err) {
      showToast('Failed to delete follow-up', 'error');
    }
  };

  const formatDate = (isoStr?: string | null) => {
    if (!isoStr) return 'Not recorded';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
        {/* Top Header */}
        <div className="p-6 border-b border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-md shadow-indigo-600/20">
              {lead?.name ? lead.name.charAt(0).toUpperCase() : 'L'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 leading-tight">
                  {isLoading ? 'Loading Lead Profile...' : lead?.name}
                </h2>
                {lead && (
                  <StatusBadge
                    status={lead.status}
                    interactive={true}
                    onStatusChange={handleStatusChange}
                  />
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {lead?.company || 'Independent'} &bull; Source: {lead?.source}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {lead && (
              <button
                type="button"
                onClick={() => onEditLead(lead)}
                className="p-2 text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors cursor-pointer"
                title="Edit Lead Details"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-200 px-6 gap-6 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`py-3.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'notes'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Notes
            <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded-full text-[10px]">
              {lead?.notes?.length || 0}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('followups')}
            className={`py-3.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'followups'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Follow-ups
            <span className="px-1.5 py-0.2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold">
              {lead?.followups?.filter((f) => f.status === 'Pending').length || 0}
            </span>
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
              <span className="w-8 h-8 border-3 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
              <p className="text-sm">Fetching CRM data...</p>
            </div>
          ) : !lead ? (
            <div className="text-center py-16 text-slate-500">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p>Lead information could not be retrieved.</p>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Quick Action Contact Bar */}
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={`mailto:${lead.email}`}
                      className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 text-slate-700 hover:text-indigo-600 transition-all text-xs font-semibold group"
                    >
                      <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 group-hover:text-indigo-600">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="text-[10px] text-slate-400 block font-normal">Direct Email</span>
                        <span className="truncate">{lead.email}</span>
                      </div>
                    </a>

                    <a
                      href={`tel:${lead.phone}`}
                      className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 text-slate-700 hover:text-emerald-700 transition-all text-xs font-semibold group"
                    >
                      <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 group-hover:text-emerald-600">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="text-[10px] text-slate-400 block font-normal">Phone Call</span>
                        <span className="truncate">{lead.phone}</span>
                      </div>
                    </a>
                  </div>

                  {/* Lead Metadata Grid */}
                  <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                      Lead Intelligence
                    </h4>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs">
                      <div>
                        <span className="text-slate-400 block mb-1">Service Requested</span>
                        <span className="font-semibold text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200/70 inline-block">
                          {lead.service || 'General Inquiry'}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block mb-1">Priority Rating</span>
                        <PriorityBadge priority={lead.priority} />
                      </div>

                      <div>
                        <span className="text-slate-400 block mb-1">Inquiry Date</span>
                        <span className="font-medium text-slate-700 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {formatDate(lead.createdAt)}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block mb-1">Last Contacted</span>
                        <span className="font-medium text-slate-700 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {formatDate(lead.lastContactedAt)}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block mb-1">Next Follow-up</span>
                        <span className="font-semibold text-indigo-700 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                          {lead.followUpDate ? formatDate(lead.followUpDate) : 'None scheduled'}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block mb-1">Lead Channel</span>
                        <span className="font-medium text-slate-700">{lead.source}</span>
                      </div>
                    </div>
                  </div>

                  {/* Original Inquiry Message */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      Client Inquiry Message
                    </h4>
                    <div className="bg-amber-50/30 border border-amber-200/60 rounded-2xl p-4 text-sm text-slate-700 leading-relaxed font-normal">
                      "{lead.message}"
                    </div>
                  </div>

                  {/* Summary of Notes & Follow-ups */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div
                      onClick={() => setActiveTab('notes')}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                        <span>Communication Notes</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-2xl font-bold text-slate-900">{lead.notes?.length || 0}</div>
                      <p className="text-[11px] text-slate-400 mt-1">Click to view log & write note</p>
                    </div>

                    <div
                      onClick={() => setActiveTab('followups')}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                        <span>Pending Follow-ups</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-2xl font-bold text-indigo-600">
                        {lead.followups?.filter((f) => f.status === 'Pending').length || 0}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Click to view reminders</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: NOTES */}
              {activeTab === 'notes' && (
                <div className="space-y-6">
                  {/* Add Note Form */}
                  <form onSubmit={handleAddNote} className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Add Interaction Note
                    </label>
                    <textarea
                      rows={3}
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      placeholder="e.g. Spoke with client. They requested technical proposal by Thursday..."
                      className="w-full p-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all resize-none"
                    />
                    <div className="flex items-center justify-end mt-2">
                      <button
                        type="submit"
                        disabled={isAddingNote || !newNoteContent.trim()}
                        className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        {isAddingNote ? 'Saving...' : 'Add Note'}
                      </button>
                    </div>
                  </form>

                  {/* Notes Timeline List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      History & Notes ({lead.notes?.length || 0})
                    </h4>

                    {(!lead.notes || lead.notes.length === 0) ? (
                      <div className="text-center py-8 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
                        No notes yet. Add your first client note above.
                      </div>
                    ) : (
                      lead.notes.map((note) => (
                        <div
                          key={note._id}
                          className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors"
                        >
                          {editingNoteId === note._id ? (
                            <div className="space-y-2">
                              <textarea
                                rows={2}
                                value={editNoteContent}
                                onChange={(e) => setEditNoteContent(e.target.value)}
                                className="w-full p-2 text-xs border border-indigo-300 rounded-lg focus:outline-hidden"
                              />
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setEditingNoteId(null)}
                                  className="px-2.5 py-1 text-xs text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateNote(note._id)}
                                  className="px-2.5 py-1 text-xs text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 cursor-pointer"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                                {note.content}
                              </p>
                              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                                <span>
                                  By <strong className="text-slate-600 font-medium">{note.createdBy}</strong> &bull;{' '}
                                  {formatDate(note.createdAt)}
                                </span>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingNoteId(note._id);
                                      setEditNoteContent(note.content);
                                    }}
                                    className="p-1 hover:text-indigo-600 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                                    title="Edit Note"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteNote(note._id)}
                                    className="p-1 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                                    title="Delete Note"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: FOLLOW-UPS */}
              {activeTab === 'followups' && (
                <div className="space-y-6">
                  {/* Schedule Follow-up Toggle */}
                  {!isAddingFollowUp ? (
                    <button
                      type="button"
                      onClick={() => setIsAddingFollowUp(true)}
                      className="w-full py-3 px-4 border border-dashed border-indigo-300 bg-indigo-50/40 text-indigo-700 hover:bg-indigo-50 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Schedule New Follow-up
                    </button>
                  ) : (
                    <form
                      onSubmit={handleAddFollowUp}
                      className="bg-slate-50 rounded-2xl p-4 border border-indigo-200/80 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Schedule Reminder
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsAddingFollowUp(false)}
                          className="text-slate-400 hover:text-slate-600 text-xs"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Follow-up Date *
                          </label>
                          <input
                            type="date"
                            value={followUpDate}
                            onChange={(e) => setFollowUpDate(e.target.value)}
                            required
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Time
                          </label>
                          <input
                            type="text"
                            value={followUpTime}
                            onChange={(e) => setFollowUpTime(e.target.value)}
                            placeholder="e.g. 10:00 AM"
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Priority
                          </label>
                          <div className="flex gap-2">
                            {(['Low', 'Medium', 'High'] as LeadPriority[]).map((p) => (
                              <button
                                key={p}
                                type="button"
                                onClick={() => setFollowUpPriority(p)}
                                className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                                  followUpPriority === p
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                {p}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Action Item / Agenda *
                        </label>
                        <textarea
                          rows={2}
                          value={followUpDesc}
                          onChange={(e) => setFollowUpDesc(e.target.value)}
                          placeholder="e.g. Call client to discuss revised timeline and pricing..."
                          required
                          className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl resize-none"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="submit"
                          disabled={isSubmittingFollowUp}
                          className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isSubmittingFollowUp ? 'Scheduling...' : 'Confirm Schedule'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Follow-up Items */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Tasks & Reminders ({lead.followups?.length || 0})
                    </h4>

                    {(!lead.followups || lead.followups.length === 0) ? (
                      <div className="text-center py-8 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
                        No follow-ups scheduled yet.
                      </div>
                    ) : (
                      lead.followups.map((f) => {
                        const isCompleted = f.status === 'Completed';
                        return (
                          <div
                            key={f._id}
                            className={`p-3.5 rounded-xl border transition-all ${
                              isCompleted
                                ? 'bg-slate-50/70 border-slate-200/60 opacity-75'
                                : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <button
                                type="button"
                                onClick={() => handleToggleFollowUp(f._id)}
                                className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                                title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                ) : (
                                  <Circle className="w-5 h-5 text-slate-400" />
                                )}
                              </button>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span
                                    className={`text-xs font-semibold ${
                                      isCompleted ? 'line-through text-slate-400' : 'text-slate-800'
                                    }`}
                                  >
                                    {f.description}
                                  </span>
                                  <PriorityBadge priority={f.priority} />
                                </div>
                                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                                  <span className="flex items-center gap-1 text-slate-600 font-medium">
                                    <Calendar className="w-3 h-3 text-slate-400" />
                                    {f.date} {f.time ? `at ${f.time}` : ''}
                                  </span>
                                  <span>&bull;</span>
                                  <span>By {f.createdBy}</span>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleDeleteFollowUp(f._id)}
                                className="text-slate-300 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
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
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
