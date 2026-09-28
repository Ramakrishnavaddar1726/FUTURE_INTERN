import {
  Lead,
  Note,
  FollowUp,
  AdminUser,
  DashboardStats,
  LeadsOverTimePoint,
  LeadSourceStat,
  Pagination,
  LeadStatus,
} from '../types/crm.js';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('leadpulse_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();
  if (!response.ok) {
    const errorMsg = data?.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  // Authentication
  auth: {
    login: async (email: string, password: string): Promise<{ success: boolean; token: string; user: AdminUser; message: string }> => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(res);
    },

    logout: async (): Promise<{ success: boolean; message: string }> => {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    getMe: async (): Promise<{ success: boolean; user: AdminUser }> => {
      const res = await fetch('/api/auth/me', {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    updateProfile: async (name: string, email: string): Promise<{ success: boolean; user: AdminUser; message: string }> => {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, email }),
      });
      return handleResponse(res);
    },

    changePassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      return handleResponse(res);
    },
  },

  // Leads
  leads: {
    getAll: async (params: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      source?: string;
      priority?: string;
      dateRange?: string;
      sortBy?: string;
    } = {}): Promise<{ success: boolean; data: Lead[]; pagination: Pagination }> => {
      const query = new URLSearchParams();
      if (params.page) query.append('page', params.page.toString());
      if (params.limit) query.append('limit', params.limit.toString());
      if (params.search) query.append('search', params.search);
      if (params.status && params.status !== 'all') query.append('status', params.status);
      if (params.source && params.source !== 'all') query.append('source', params.source);
      if (params.priority && params.priority !== 'all') query.append('priority', params.priority);
      if (params.dateRange && params.dateRange !== 'all') query.append('dateRange', params.dateRange);
      if (params.sortBy) query.append('sortBy', params.sortBy);

      const res = await fetch(`/api/leads?${query.toString()}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    getById: async (id: string): Promise<{ success: boolean; data: Lead }> => {
      const res = await fetch(`/api/leads/${id}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    create: async (leadData: Partial<Lead>): Promise<{ success: boolean; data: Lead; message: string }> => {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });
      return handleResponse(res);
    },

    update: async (id: string, leadData: Partial<Lead>): Promise<{ success: boolean; data: Lead; message: string }> => {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(leadData),
      });
      return handleResponse(res);
    },

    updateStatus: async (id: string, status: LeadStatus): Promise<{ success: boolean; data: Lead; message: string }> => {
      const res = await fetch(`/api/leads/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      return handleResponse(res);
    },

    delete: async (id: string): Promise<{ success: boolean; message: string }> => {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Notes
  notes: {
    getByLeadId: async (leadId: string): Promise<{ success: boolean; data: Note[] }> => {
      const res = await fetch(`/api/leads/${leadId}/notes`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    create: async (leadId: string, content: string): Promise<{ success: boolean; data: Note; message: string }> => {
      const res = await fetch(`/api/leads/${leadId}/notes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ content }),
      });
      return handleResponse(res);
    },

    update: async (id: string, content: string): Promise<{ success: boolean; data: Note; message: string }> => {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ content }),
      });
      return handleResponse(res);
    },

    delete: async (id: string): Promise<{ success: boolean; message: string }> => {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Follow-ups
  followups: {
    getAll: async (params: { leadId?: string; status?: string } = {}): Promise<{ success: boolean; data: FollowUp[] }> => {
      const query = new URLSearchParams();
      if (params.leadId) query.append('leadId', params.leadId);
      if (params.status && params.status !== 'all') query.append('status', params.status);

      const res = await fetch(`/api/followups?${query.toString()}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    create: async (
      leadId: string,
      data: { date: string; time?: string; description: string; priority?: string; leadName?: string }
    ): Promise<{ success: boolean; data: FollowUp; message: string }> => {
      const res = await fetch(`/api/leads/${leadId}/followups`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    update: async (id: string, data: Partial<FollowUp>): Promise<{ success: boolean; data: FollowUp; message: string }> => {
      const res = await fetch(`/api/followups/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    toggleComplete: async (id: string): Promise<{ success: boolean; data: FollowUp; message: string }> => {
      const res = await fetch(`/api/followups/${id}/complete`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    delete: async (id: string): Promise<{ success: boolean; message: string }> => {
      const res = await fetch(`/api/followups/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Dashboard
  dashboard: {
    getStats: async (): Promise<{ success: boolean; data: DashboardStats }> => {
      const res = await fetch('/api/dashboard/stats', {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    getLeadsOverTime: async (range: '7d' | '30d' = '30d'): Promise<{ success: boolean; data: LeadsOverTimePoint[] }> => {
      const res = await fetch(`/api/dashboard/leads-over-time?range=${range}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    getLeadSources: async (): Promise<{ success: boolean; data: LeadSourceStat[] }> => {
      const res = await fetch('/api/dashboard/lead-sources', {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Supabase Integration
  supabase: {
    getStatus: async (): Promise<{
      success: boolean;
      connected: boolean;
      projectId: string;
      url: string;
      message: string;
      tablesStatus?: Record<string, string>;
      sqlSchema?: { appointments: string; leads: string };
    }> => {
      const res = await fetch('/api/supabase/status');
      return handleResponse(res);
    },

    testInsert: async (payload?: any): Promise<{
      success: boolean;
      message: string;
      results: Record<string, any>;
      sampleData: any;
    }> => {
      const res = await fetch('/api/supabase/test-insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload || {}),
      });
      return handleResponse(res);
    },

    syncAll: async (): Promise<{
      success: boolean;
      count: number;
      syncedCount: number;
      message: string;
    }> => {
      const res = await fetch('/api/supabase/sync-all', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },
};
