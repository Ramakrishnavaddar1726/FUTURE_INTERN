import React, { useState, useEffect } from 'react';
import { FileText, Search, ExternalLink, Trash2, Calendar, User, MessageSquare } from 'lucide-react';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.js';
import { Note, Lead } from '../types/crm.js';

interface NotesPageProps {
  onViewLead: (leadId: string) => void;
}

export const Notes: React.FC<NotesPageProps> = ({ onViewLead }) => {
  const { showToast } = useToast();
  const [allNotes, setAllNotes] = useState<(Note & { leadName?: string; leadCompany?: string })[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotesAndLeads = async () => {
    try {
      setIsLoading(true);
      const leadsRes = await api.leads.getAll({ limit: 100 });
      if (leadsRes.success) {
        const leads = leadsRes.data;
        const notesList: (Note & { leadName?: string; leadCompany?: string })[] = [];

        for (const lead of leads) {
          try {
            const notesRes = await api.notes.getByLeadId(lead._id);
            if (notesRes.success && notesRes.data) {
              notesRes.data.forEach((n) => {
                notesList.push({
                  ...n,
                  leadName: lead.name,
                  leadCompany: lead.company,
                });
              });
            }
          } catch (e) {
            // quiet
          }
        }

        notesList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setAllNotes(notesList);
      }
    } catch (err) {
      showToast('Failed to load notes stream', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotesAndLeads();
  }, []);

  const handleDeleteNote = async (id: string) => {
    try {
      const res = await api.notes.delete(id);
      if (res.success) {
        showToast('Note deleted', 'info');
        setAllNotes((prev) => prev.filter((n) => n._id !== id));
      }
    } catch (e) {
      showToast('Failed to delete note', 'error');
    }
  };

  const filteredNotes = allNotes.filter((n) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      n.content?.toLowerCase().includes(q) ||
      n.leadName?.toLowerCase().includes(q) ||
      n.leadCompany?.toLowerCase().includes(q) ||
      n.createdBy?.toLowerCase().includes(q)
    );
  });

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Client Interaction Notes</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Unified chronological audit trail of all team interaction logs and meeting summaries
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes, clients, or team..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
          />
        </div>
      </div>

      {/* Notes Stream */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <span className="w-8 h-8 border-3 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin inline-block mb-3" />
            <p className="text-xs text-slate-400">Loading communication history...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-800">No notes found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Add interaction notes directly from any lead's detailed CRM profile.
            </p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note._id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => onViewLead(note.leadId)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      {note.leadName || 'Client Profile'}
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    {note.leadCompany && (
                      <span className="text-[11px] text-slate-400 font-medium">
                        &bull; {note.leadCompany}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-normal">
                    {note.content}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1 text-slate-600 font-medium">
                      <User className="w-3 h-3 text-slate-400" />
                      {note.createdBy}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {formatDate(note.createdAt)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteNote(note._id)}
                  className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete Note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
