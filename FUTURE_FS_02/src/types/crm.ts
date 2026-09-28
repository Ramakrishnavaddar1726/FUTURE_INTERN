export type LeadStatus = 'New' | 'Contacted' | 'Converted';
export type LeadSource = 'Website Contact Form' | 'Referral' | 'Social Media' | 'Advertisement' | 'Other';
export type LeadPriority = 'Low' | 'Medium' | 'High';

export interface Lead {
  _id: string;
  id?: string;
  supabaseId?: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  source: LeadSource;
  status: LeadStatus;
  priority: LeadPriority;
  lastContactedAt?: string | null;
  followUpDate?: string | null;
  createdAt: string;
  updatedAt: string;
  notes?: Note[];
  followups?: FollowUp[];
}

export interface Note {
  _id: string;
  id?: string;
  leadId: string;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface FollowUp {
  _id: string;
  id?: string;
  leadId: string;
  leadName?: string;
  date: string;
  time: string;
  description: string;
  priority: LeadPriority;
  status: 'Pending' | 'Completed';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
  createdAt?: string;
}

export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  convertedLeads: number;
  pendingFollowups: number;
  conversionRate: number;
}

export interface LeadsOverTimePoint {
  date: string;
  label: string;
  count: number;
  newLeads: number;
  convertedLeads: number;
}

export interface LeadSourceStat {
  source: string;
  count: number;
  percentage: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
