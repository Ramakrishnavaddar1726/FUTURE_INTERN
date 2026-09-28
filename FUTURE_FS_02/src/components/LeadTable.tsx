import React from 'react';
import { Lead, LeadStatus } from '../types/crm.js';
import { StatusBadge } from './StatusBadge.js';
import { Eye, Edit2, Trash2, Calendar, Mail, Phone, Building2 } from 'lucide-react';

interface LeadTableProps {
  leads: Lead[];
  selectedLeadIds: string[];
  onSelectLead: (id: string) => void;
  onSelectAll: () => void;
  onViewLead: (lead: Lead) => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (lead: Lead) => void;
  onStatusChange: (id: string, newStatus: LeadStatus) => void;
  isLoading: boolean;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  selectedLeadIds,
  onSelectLead,
  onSelectAll,
  onViewLead,
  onEditLead,
  onDeleteLead,
  onStatusChange,
  isLoading,
}) => {
  const isAllSelected = leads.length > 0 && selectedLeadIds.length === leads.length;

  const formatDate = (isoStr?: string | null) => {
    if (!isoStr) return '-';
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

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-8 flex flex-col items-center justify-center gap-3">
          <span className="w-8 h-8 border-3 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Loading leads data from database...</p>
        </div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-12 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400 mb-4">
          <Mail className="w-8 h-8" />
        </div>
        <h4 className="text-base font-bold text-slate-800">No leads found</h4>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
          New leads submitted through your contact form or added manually will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Desktop / Tablet Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onSelectAll}
                  className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  title="Select all leads"
                />
              </th>
              <th className="py-3.5 px-4 font-semibold">Lead Contact</th>
              <th className="py-3.5 px-4 font-semibold">Company / Service</th>
              <th className="py-3.5 px-4 font-semibold">Source</th>
              <th className="py-3.5 px-4 font-semibold">Status</th>
              <th className="py-3.5 px-4 font-semibold">Created Date</th>
              <th className="py-3.5 px-4 font-semibold">Follow-up</th>
              <th className="py-3.5 px-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {leads.map((lead) => {
              const isSelected = selectedLeadIds.includes(lead._id);
              return (
                <tr
                  key={lead._id}
                  className={`hover:bg-slate-50/80 transition-colors group ${
                    isSelected ? 'bg-indigo-50/30' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-3.5 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectLead(lead._id)}
                      className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                  </td>

                  {/* Name, Email, Phone */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                      <span
                        onClick={() => onViewLead(lead)}
                        className="cursor-pointer hover:underline"
                      >
                        {lead.name}
                      </span>
                    </div>
                    <div className="text-slate-500 mt-0.5 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <a
                          href={`mailto:${lead.email}`}
                          className="hover:text-slate-800 truncate max-w-[180px]"
                        >
                          {lead.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{lead.phone}</span>
                      </div>
                    </div>
                  </td>

                  {/* Company & Service */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[160px]">{lead.company || 'Independent'}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[160px] mt-0.5">
                      {lead.service}
                    </div>
                  </td>

                  {/* Source */}
                  <td className="py-3.5 px-4">
                    <span className="inline-block text-slate-600 font-medium text-[11px] bg-slate-100 px-2 py-0.5 rounded-md">
                      {lead.source}
                    </span>
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3.5 px-4">
                    <StatusBadge
                      status={lead.status}
                      interactive={true}
                      onStatusChange={(newStatus) => onStatusChange(lead._id, newStatus)}
                    />
                  </td>

                  {/* Created Date */}
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {formatDate(lead.createdAt)}
                  </td>

                  {/* Follow-up Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {lead.followUpDate ? (
                      <span className="text-indigo-600 font-semibold flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(lead.followUpDate)}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">None</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onViewLead(lead)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title="View Full Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditLead(lead)}
                        className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Lead"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteLead(lead)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
