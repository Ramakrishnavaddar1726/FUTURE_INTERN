import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Filter,
  Download,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.js';
import { LeadTable } from '../components/LeadTable.js';
import { LeadModal } from '../components/LeadModal.js';
import { LeadDetailsDrawer } from '../components/LeadDetailsDrawer.js';
import { ConfirmDialog } from '../components/ConfirmDialog.js';
import { Lead, LeadStatus, Pagination } from '../types/crm.js';

interface LeadsProps {
  initialSearch?: string;
  selectedLeadId?: string | null;
  onClearSelectedLeadId?: () => void;
}

export const Leads: React.FC<LeadsProps> = ({
  initialSearch = '',
  selectedLeadId = null,
  onClearSelectedLeadId,
}) => {
  const { showToast } = useToast();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  // Filters & Search
  const [search, setSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const [isLoading, setIsLoading] = useState(true);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [activeLeadDetailsId, setActiveLeadDetailsId] = useState<string | null>(selectedLeadId);
  const [deleteConfirmLead, setDeleteConfirmLead] = useState<Lead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (selectedLeadId) {
      setActiveLeadDetailsId(selectedLeadId);
    }
  }, [selectedLeadId]);

  const fetchLeads = async (pageToFetch: number = pagination.page) => {
    try {
      setIsLoading(true);
      const res = await api.leads.getAll({
        page: pageToFetch,
        limit: pagination.limit,
        search,
        status: statusFilter,
        source: sourceFilter,
        priority: priorityFilter,
        dateRange: dateRangeFilter,
        sortBy,
      });

      if (res.success) {
        setLeads(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      showToast('Failed to load leads from database', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(1);
  }, [search, statusFilter, sourceFilter, priorityFilter, dateRangeFilter, sortBy, pagination.limit]);

  // Status Change Handler
  const handleInlineStatusChange = async (id: string, newStatus: LeadStatus) => {
    try {
      const res = await api.leads.updateStatus(id, newStatus);
      if (res.success) {
        showToast(`Lead status updated to ${newStatus}`, 'success');
        setLeads((prev) =>
          prev.map((l) => (l._id === id ? { ...l, status: newStatus, lastContactedAt: new Date().toISOString() } : l))
        );
      }
    } catch (err) {
      showToast('Failed to update lead status', 'error');
    }
  };

  // Add / Edit Handlers
  const handleAddSubmit = async (leadData: Partial<Lead>): Promise<boolean> => {
    try {
      const res = await api.leads.create(leadData);
      if (res.success) {
        showToast('New lead added to database successfully', 'success');
        fetchLeads(1);
        return true;
      }
      return false;
    } catch (err) {
      showToast((err as Error).message || 'Failed to create lead', 'error');
      return false;
    }
  };

  const handleEditSubmit = async (leadData: Partial<Lead>): Promise<boolean> => {
    if (!editingLead) return false;
    try {
      const res = await api.leads.update(editingLead._id, leadData);
      if (res.success) {
        showToast('Lead details updated successfully', 'success');
        fetchLeads(pagination.page);
        return true;
      }
      return false;
    } catch (err) {
      showToast((err as Error).message || 'Failed to update lead', 'error');
      return false;
    }
  };

  // Delete Handler
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmLead) return;
    try {
      setIsDeleting(true);
      const res = await api.leads.delete(deleteConfirmLead._id);
      if (res.success) {
        showToast('Lead and associated notes deleted permanently', 'info');
        setDeleteConfirmLead(null);
        setSelectedLeadIds((prev) => prev.filter((id) => id !== deleteConfirmLead._id));
        fetchLeads(pagination.page);
      }
    } catch (err) {
      showToast('Failed to delete lead', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Selection handlers
  const handleSelectLead = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeadIds.length === leads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(leads.map((l) => l._id));
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (leads.length === 0) {
      showToast('No leads available to export', 'info');
      return;
    }

    const headers = ['Name', 'Email', 'Phone', 'Company', 'Service', 'Source', 'Status', 'Priority', 'Created Date'];
    const rows = leads.map((l) => [
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.email.replace(/"/g, '""')}"`,
      `"${l.phone.replace(/"/g, '""')}"`,
      `"${(l.company || '').replace(/"/g, '""')}"`,
      `"${(l.service || '').replace(/"/g, '""')}"`,
      `"${l.source}"`,
      `"${l.status}"`,
      `"${l.priority}"`,
      `"${l.createdAt}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Leads exported as CSV file', 'success');
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setSourceFilter('all');
    setPriorityFilter('all');
    setDateRangeFilter('all');
    setSortBy('newest');
  };

  const hasActiveFilters =
    search ||
    statusFilter !== 'all' ||
    sourceFilter !== 'all' ||
    priorityFilter !== 'all' ||
    dateRangeFilter !== 'all' ||
    sortBy !== 'newest';

  return (
    <div className="space-y-5">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Leads Management Table</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Filter, search, update status, and manage client pipeline records
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Export CSV
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Lead Manually
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone, company, or service..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Status Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {['all', 'New', 'Contacted', 'Converted'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'all' ? 'All Statuses' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filters row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Source Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Source:</span>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Sources</option>
              <option value="Website Contact Form">Website Contact Form</option>
              <option value="Referral">Referral</option>
              <option value="Social Media">Social Media</option>
              <option value="Advertisement">Advertisement</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Date:</span>
            <select
              value={dateRangeFilter}
              onChange={(e) => setDateRangeFilter(e.target.value)}
              className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="followup">Follow-up Date</option>
              <option value="status">Status</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="ml-auto text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Leads Table Component */}
      <LeadTable
        leads={leads}
        selectedLeadIds={selectedLeadIds}
        onSelectLead={handleSelectLead}
        onSelectAll={handleSelectAll}
        onViewLead={(lead) => setActiveLeadDetailsId(lead._id)}
        onEditLead={(lead) => {
          setEditingLead(lead);
          setIsEditModalOpen(true);
        }}
        onDeleteLead={(lead) => setDeleteConfirmLead(lead)}
        onStatusChange={handleInlineStatusChange}
        isLoading={isLoading}
      />

      {/* Pagination Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-slate-500">
            Showing <strong className="text-slate-800 font-semibold">{leads.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1}</strong> to{' '}
            <strong className="text-slate-800 font-semibold">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </strong>{' '}
            of <strong className="text-slate-800 font-semibold">{pagination.total}</strong> total leads
          </span>

          <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
            <span className="text-slate-400">Rows:</span>
            <select
              value={pagination.limit}
              onChange={(e) => setPagination({ ...pagination, limit: Number(e.target.value), page: 1 })}
              className="py-1 px-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Page Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={pagination.page <= 1 || isLoading}
            onClick={() => fetchLeads(pagination.page - 1)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => fetchLeads(pageNum)}
              className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                pagination.page === pageNum
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            type="button"
            disabled={pagination.page >= pagination.totalPages || isLoading}
            onClick={() => fetchLeads(pagination.page + 1)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Add Lead Modal */}
      <LeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        mode="add"
      />

      {/* Edit Lead Modal */}
      <LeadModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingLead(null);
        }}
        onSubmit={handleEditSubmit}
        initialData={editingLead}
        mode="edit"
      />

      {/* Lead Details Drawer */}
      <LeadDetailsDrawer
        leadId={activeLeadDetailsId}
        onClose={() => {
          setActiveLeadDetailsId(null);
          if (onClearSelectedLeadId) onClearSelectedLeadId();
        }}
        onLeadUpdated={() => fetchLeads(pagination.page)}
        onEditLead={(lead) => {
          setEditingLead(lead);
          setIsEditModalOpen(true);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirmLead}
        title="Delete Client Lead Record"
        message={`Are you sure you want to permanently delete "${deleteConfirmLead?.name}" (${deleteConfirmLead?.company})? This will also remove all associated communication notes and scheduled follow-up tasks. This action cannot be undone.`}
        confirmText="Yes, Delete Lead"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmLead(null)}
        isLoading={isDeleting}
      />
    </div>
  );
};
