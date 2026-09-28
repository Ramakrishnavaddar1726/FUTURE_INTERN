import fs from 'fs';
import path from 'path';
import { INITIAL_ADMINS, INITIAL_LEADS, INITIAL_NOTES, INITIAL_FOLLOWUPS } from '../seed/seedData.js';
import { getIsConnected } from '../config/db.js';
import { Lead, ILead } from '../models/Lead.js';
import { Note, INote } from '../models/Note.js';
import { FollowUp, IFollowUp } from '../models/FollowUp.js';
import { Admin, IAdmin } from '../models/Admin.js';
import { fetchSupabaseAppointments, fetchSupabaseLeads } from '../config/supabase.js';

interface StorageData {
  admins: any[];
  leads: any[];
  notes: any[];
  followups: any[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'crm_store.json');

// In-memory runtime cache
let memoryStore: StorageData = {
  admins: [...INITIAL_ADMINS],
  leads: [...INITIAL_LEADS],
  notes: [...INITIAL_NOTES],
  followups: [...INITIAL_FOLLOWUPS],
};

export const syncFromSupabase = async (): Promise<void> => {
  try {
    const [supabaseLeads, supabaseAppts] = await Promise.all([
      fetchSupabaseLeads(),
      fetchSupabaseAppointments(),
    ]);

    let changed = false;

    // Synchronize leads from Supabase into local memory store
    for (const sbLead of supabaseLeads) {
      const existing = memoryStore.leads.find(
        (l) =>
          l.id === sbLead.id ||
          l._id === sbLead.id ||
          l.supabaseId === sbLead.id ||
          (l.email?.toLowerCase() === sbLead.email?.toLowerCase() &&
            Math.abs(new Date(l.createdAt).getTime() - new Date(sbLead.created_at).getTime()) < 300000)
      );

      if (!existing) {
        memoryStore.leads.unshift({
          _id: sbLead.id,
          id: sbLead.id,
          name: sbLead.name,
          email: sbLead.email,
          phone: sbLead.phone || '',
          company: sbLead.company || 'Direct Client',
          service: sbLead.service || 'Appointment Consultation',
          message: sbLead.message || '',
          source: sbLead.source || 'Website Contact Form',
          status: sbLead.status || 'New',
          priority: sbLead.priority || 'Medium',
          followUpDate: sbLead.follow_up_date || null,
          createdAt: sbLead.created_at || new Date().toISOString(),
          updatedAt: sbLead.created_at || new Date().toISOString(),
          supabaseId: sbLead.id,
        });
        changed = true;
      } else if (!existing.supabaseId) {
        existing.supabaseId = sbLead.id;
        changed = true;
      }
    }

    // Synchronize appointments from Supabase into local memory store
    for (const sbAppt of supabaseAppts) {
      const existing = memoryStore.leads.find(
        (l) =>
          l.id === sbAppt.id ||
          l._id === sbAppt.id ||
          l.supabaseId === sbAppt.id ||
          (l.email?.toLowerCase() === sbAppt.email?.toLowerCase() &&
            Math.abs(new Date(l.createdAt).getTime() - new Date(sbAppt.created_at).getTime()) < 300000)
      );

      if (!existing) {
        memoryStore.leads.unshift({
          _id: sbAppt.id,
          id: sbAppt.id,
          name: sbAppt.name,
          email: sbAppt.email,
          phone: sbAppt.phone || '',
          company: 'Direct Client',
          service: sbAppt.service || 'Consultation',
          message:
            sbAppt.notes ||
            `Booked appointment for ${sbAppt.appointment_date || sbAppt.date} at ${sbAppt.appointment_time || sbAppt.time}`,
          source: 'Website Appointment Booking Form',
          status: sbAppt.status || 'New',
          priority: 'High',
          followUpDate: sbAppt.appointment_date || sbAppt.date || null,
          createdAt: sbAppt.created_at || new Date().toISOString(),
          updatedAt: sbAppt.created_at || new Date().toISOString(),
          supabaseId: sbAppt.id,
        });
        changed = true;
      } else if (!existing.supabaseId) {
        existing.supabaseId = sbAppt.id;
        changed = true;
      }
    }

    if (changed) {
      persistStorage();
    }
  } catch (err) {
    console.warn('Sync from Supabase notice:', (err as Error).message);
  }
};

// Ensure data folder and file exist
export const initStorage = async () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.leads) && parsed.leads.length > 0) {
        memoryStore = parsed;
      } else {
        persistStorage();
      }
    } else {
      persistStorage();
    }
    // Pull any remote records from Supabase
    await syncFromSupabase();
  } catch (err) {
    console.error('Failed to read local store, using default memory state:', err);
    persistStorage();
  }
};

const persistStorage = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(memoryStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write to local storage file:', err);
  }
};

// Admin Operations
export const findAdminByEmail = async (email: string) => {
  if (getIsConnected()) {
    try {
      const doc = await Admin.findOne({ email: email.toLowerCase() });
      if (doc) return doc;
    } catch (e) {
      // fallback
    }
  }
  return memoryStore.admins.find((a) => a.email.toLowerCase() === email.toLowerCase());
};

export const findAdminById = async (id: string) => {
  if (getIsConnected()) {
    try {
      const doc = await Admin.findById(id);
      if (doc) return doc;
    } catch (e) {
      // fallback
    }
  }
  return memoryStore.admins.find((a) => a._id === id || a.id === id);
};

export const updateAdminPassword = async (id: string, newHashedPassword: string) => {
  if (getIsConnected()) {
    try {
      await Admin.findByIdAndUpdate(id, { password: newHashedPassword });
    } catch (e) {
      // fallback
    }
  }
  const admin = memoryStore.admins.find((a) => a._id === id || a.id === id);
  if (admin) {
    admin.password = newHashedPassword;
    admin.updatedAt = new Date().toISOString();
    persistStorage();
    return true;
  }
  return false;
};

export const updateAdminProfile = async (id: string, name: string, email: string) => {
  if (getIsConnected()) {
    try {
      await Admin.findByIdAndUpdate(id, { name, email });
    } catch (e) {
      // fallback
    }
  }
  const admin = memoryStore.admins.find((a) => a._id === id || a.id === id);
  if (admin) {
    admin.name = name;
    admin.email = email;
    admin.updatedAt = new Date().toISOString();
    persistStorage();
    return admin;
  }
  return null;
};

// Lead Operations
export interface LeadFilterOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  source?: string;
  priority?: string;
  dateRange?: string; // 'today' | '7d' | '30d' | 'all'
  sortBy?: string; // 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'followup' | 'status'
}

export const getLeads = async (options: LeadFilterOptions = {}) => {
  // Sync latest records from Supabase before returning
  await syncFromSupabase();

  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.max(1, Number(options.limit) || 10);
  const search = (options.search || '').trim().toLowerCase();
  const status = options.status || 'all';
  const source = options.source || 'all';
  const priority = options.priority || 'all';
  const dateRange = options.dateRange || 'all';
  const sortBy = options.sortBy || 'newest';

  let filtered = [...memoryStore.leads];

  // Search filter (name, email, phone, company)
  if (search) {
    filtered = filtered.filter((lead) => {
      return (
        lead.name?.toLowerCase().includes(search) ||
        lead.email?.toLowerCase().includes(search) ||
        lead.phone?.toLowerCase().includes(search) ||
        lead.company?.toLowerCase().includes(search) ||
        lead.service?.toLowerCase().includes(search)
      );
    });
  }

  // Status filter
  if (status && status !== 'all') {
    filtered = filtered.filter((lead) => lead.status?.toLowerCase() === status.toLowerCase());
  }

  // Source filter
  if (source && source !== 'all') {
    filtered = filtered.filter((lead) => lead.source?.toLowerCase() === source.toLowerCase());
  }

  // Priority filter
  if (priority && priority !== 'all') {
    filtered = filtered.filter((lead) => lead.priority?.toLowerCase() === priority.toLowerCase());
  }

  // Date range filter
  if (dateRange && dateRange !== 'all') {
    const now = Date.now();
    let cutoff = 0;
    if (dateRange === 'today') {
      cutoff = now - 24 * 60 * 60 * 1000;
    } else if (dateRange === '7d') {
      cutoff = now - 7 * 24 * 60 * 60 * 1000;
    } else if (dateRange === '30d') {
      cutoff = now - 30 * 24 * 60 * 60 * 1000;
    }
    if (cutoff > 0) {
      filtered = filtered.filter((lead) => new Date(lead.createdAt).getTime() >= cutoff);
    }
  }

  // Sorting
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'name-asc':
        return (a.name || '').localeCompare(b.name || '');
      case 'name-desc':
        return (b.name || '').localeCompare(a.name || '');
      case 'followup':
        if (!a.followUpDate) return 1;
        if (!b.followUpDate) return -1;
        return new Date(a.followUpDate).getTime() - new Date(b.followUpDate).getTime();
      case 'status':
        return (a.status || '').localeCompare(b.status || '');
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return {
    leads: paginated,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};

export const findLeadById = async (id: string) => {
  const lead = memoryStore.leads.find((l) => l._id === id || l.id === id);
  if (!lead) return null;

  // attach notes and followups for details view
  const notes = memoryStore.notes.filter((n) => n.leadId === id || n.leadId === lead._id);
  const followups = memoryStore.followups.filter((f) => f.leadId === id || f.leadId === lead._id);

  return {
    ...lead,
    notes: notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    followups: followups.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
  };
};

export const createLead = async (leadData: any) => {
  const newId = `lead-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const newLead = {
    _id: newId,
    id: newId,
    name: leadData.name?.trim(),
    email: leadData.email?.trim().toLowerCase(),
    phone: leadData.phone?.trim() || '',
    company: leadData.company?.trim() || 'Independent',
    service: leadData.service?.trim() || 'General Inquiry',
    message: leadData.message?.trim(),
    source: leadData.source || 'Website Contact Form',
    status: leadData.status || 'New',
    priority: leadData.priority || 'Medium',
    followUpDate: leadData.followUpDate || null,
    lastContactedAt: leadData.status === 'Contacted' || leadData.status === 'Converted' ? now : null,
    createdAt: now,
    updatedAt: now,
  };

  memoryStore.leads.unshift(newLead);
  persistStorage();

  // If MongoDB connected, sync to Mongoose
  if (getIsConnected()) {
    try {
      await Lead.create(newLead);
    } catch (e) {
      // quiet log
    }
  }

  return newLead;
};

export const updateLead = async (id: string, updateData: any) => {
  const index = memoryStore.leads.findIndex((l) => l._id === id || l.id === id);
  if (index === -1) return null;

  const now = new Date().toISOString();
  const current = memoryStore.leads[index];

  // If status is changing to Contacted/Converted and wasn't before
  let lastContactedAt = current.lastContactedAt;
  if (updateData.status && updateData.status !== current.status && updateData.status !== 'New') {
    lastContactedAt = now;
  }

  const updated = {
    ...current,
    ...updateData,
    lastContactedAt: updateData.lastContactedAt !== undefined ? updateData.lastContactedAt : lastContactedAt,
    updatedAt: now,
  };

  memoryStore.leads[index] = updated;

  // Also update leadName in any associated followups if name changed
  if (updateData.name && updateData.name !== current.name) {
    memoryStore.followups.forEach((f) => {
      if (f.leadId === id || f.leadId === current._id) {
        f.leadName = updateData.name;
      }
    });
  }

  persistStorage();

  if (getIsConnected()) {
    try {
      await Lead.findByIdAndUpdate(id, updated);
    } catch (e) {
      // quiet
    }
  }

  return updated;
};

export const updateLeadStatus = async (id: string, status: 'New' | 'Contacted' | 'Converted') => {
  const index = memoryStore.leads.findIndex((l) => l._id === id || l.id === id);
  if (index === -1) return null;

  const now = new Date().toISOString();
  const current = memoryStore.leads[index];
  const lastContactedAt = status !== 'New' ? now : current.lastContactedAt;

  memoryStore.leads[index] = {
    ...current,
    status,
    lastContactedAt,
    updatedAt: now,
  };

  persistStorage();

  if (getIsConnected()) {
    try {
      await Lead.findByIdAndUpdate(id, { status, lastContactedAt, updatedAt: now });
    } catch (e) {
      // quiet
    }
  }

  return memoryStore.leads[index];
};

export const deleteLead = async (id: string) => {
  const index = memoryStore.leads.findIndex((l) => l._id === id || l.id === id);
  if (index === -1) return false;

  memoryStore.leads.splice(index, 1);
  // delete associated notes and followups
  memoryStore.notes = memoryStore.notes.filter((n) => n.leadId !== id);
  memoryStore.followups = memoryStore.followups.filter((f) => f.leadId !== id);

  persistStorage();

  if (getIsConnected()) {
    try {
      await Lead.findByIdAndDelete(id);
      await Note.deleteMany({ leadId: id });
      await FollowUp.deleteMany({ leadId: id });
    } catch (e) {
      // quiet
    }
  }

  return true;
};

// Notes
export const getNotesByLeadId = async (leadId: string) => {
  return memoryStore.notes
    .filter((n) => n.leadId === leadId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const createNote = async (leadId: string, content: string, createdBy: string = 'Admin User') => {
  const newId = `note-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const newNote = {
    _id: newId,
    id: newId,
    leadId,
    content: content.trim(),
    createdBy,
    createdAt: now,
    updatedAt: now,
  };

  memoryStore.notes.unshift(newNote);
  persistStorage();

  if (getIsConnected()) {
    try {
      await Note.create(newNote);
    } catch (e) {
      // quiet
    }
  }

  return newNote;
};

export const updateNote = async (id: string, content: string) => {
  const note = memoryStore.notes.find((n) => n._id === id || n.id === id);
  if (!note) return null;

  note.content = content.trim();
  note.updatedAt = new Date().toISOString();
  persistStorage();

  if (getIsConnected()) {
    try {
      await Note.findByIdAndUpdate(id, { content: note.content, updatedAt: note.updatedAt });
    } catch (e) {
      // quiet
    }
  }

  return note;
};

export const deleteNote = async (id: string) => {
  const index = memoryStore.notes.findIndex((n) => n._id === id || n.id === id);
  if (index === -1) return false;

  memoryStore.notes.splice(index, 1);
  persistStorage();

  if (getIsConnected()) {
    try {
      await Note.findByIdAndDelete(id);
    } catch (e) {
      // quiet
    }
  }

  return true;
};

// Follow-ups
export const getFollowUps = async (options: { leadId?: string; status?: string } = {}) => {
  let list = [...memoryStore.followups];

  if (options.leadId) {
    list = list.filter((f) => f.leadId === options.leadId);
  }

  if (options.status && options.status !== 'all') {
    list = list.filter((f) => f.status.toLowerCase() === options.status?.toLowerCase());
  }

  // Populate lead name if missing
  list.forEach((f) => {
    if (!f.leadName) {
      const matchLead = memoryStore.leads.find((l) => l._id === f.leadId || l.id === f.leadId);
      if (matchLead) f.leadName = matchLead.name;
    }
  });

  return list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const createFollowUp = async (followUpData: any) => {
  const newId = `follow-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  // Find lead name
  const matchLead = memoryStore.leads.find((l) => l._id === followUpData.leadId || l.id === followUpData.leadId);
  const leadName = followUpData.leadName || (matchLead ? matchLead.name : 'Unknown Lead');

  const newFollowUp = {
    _id: newId,
    id: newId,
    leadId: followUpData.leadId,
    leadName,
    date: followUpData.date,
    time: followUpData.time || '10:00 AM',
    description: followUpData.description.trim(),
    priority: followUpData.priority || 'Medium',
    status: followUpData.status || 'Pending',
    createdBy: followUpData.createdBy || 'Admin User',
    createdAt: now,
    updatedAt: now,
  };

  memoryStore.followups.push(newFollowUp);

  // Also update lead's followUpDate
  if (matchLead) {
    matchLead.followUpDate = followUpData.date;
  }

  persistStorage();

  if (getIsConnected()) {
    try {
      await FollowUp.create(newFollowUp);
      if (matchLead) {
        await Lead.findByIdAndUpdate(matchLead._id, { followUpDate: followUpData.date });
      }
    } catch (e) {
      // quiet
    }
  }

  return newFollowUp;
};

export const updateFollowUp = async (id: string, updateData: any) => {
  const item = memoryStore.followups.find((f) => f._id === id || f.id === id);
  if (!item) return null;

  Object.assign(item, updateData, { updatedAt: new Date().toISOString() });
  persistStorage();

  if (getIsConnected()) {
    try {
      await FollowUp.findByIdAndUpdate(id, item);
    } catch (e) {
      // quiet
    }
  }

  return item;
};

export const toggleFollowUpComplete = async (id: string) => {
  const item = memoryStore.followups.find((f) => f._id === id || f.id === id);
  if (!item) return null;

  item.status = item.status === 'Completed' ? 'Pending' : 'Completed';
  item.updatedAt = new Date().toISOString();
  persistStorage();

  if (getIsConnected()) {
    try {
      await FollowUp.findByIdAndUpdate(id, { status: item.status, updatedAt: item.updatedAt });
    } catch (e) {
      // quiet
    }
  }

  return item;
};

export const deleteFollowUp = async (id: string) => {
  const index = memoryStore.followups.findIndex((f) => f._id === id || f.id === id);
  if (index === -1) return false;

  memoryStore.followups.splice(index, 1);
  persistStorage();

  if (getIsConnected()) {
    try {
      await FollowUp.findByIdAndDelete(id);
    } catch (e) {
      // quiet
    }
  }

  return true;
};

// Dashboard Analytics
export const getDashboardStats = async () => {
  const totalLeads = memoryStore.leads.length;
  const newLeads = memoryStore.leads.filter((l) => l.status === 'New').length;
  const contactedLeads = memoryStore.leads.filter((l) => l.status === 'Contacted').length;
  const convertedLeads = memoryStore.leads.filter((l) => l.status === 'Converted').length;
  const pendingFollowups = memoryStore.followups.filter((f) => f.status === 'Pending').length;

  const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

  return {
    totalLeads,
    newLeads,
    contactedLeads,
    convertedLeads,
    pendingFollowups,
    conversionRate,
  };
};

export const getLeadsOverTime = async (days: number = 30) => {
  const result: { date: string; label: string; count: number; newLeads: number; convertedLeads: number }[] = [];
  const now = new Date();

  // Generate day buckets
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split('T')[0];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const label = `${monthNames[d.getMonth()]} ${d.getDate()}`;

    // count leads created on that day
    const matchingLeads = memoryStore.leads.filter((lead) => {
      return lead.createdAt && lead.createdAt.startsWith(dateStr);
    });

    const newOnDay = matchingLeads.filter((l) => l.status === 'New').length;
    const convOnDay = matchingLeads.filter((l) => l.status === 'Converted').length;

    result.push({
      date: dateStr,
      label,
      count: matchingLeads.length,
      newLeads: newOnDay,
      convertedLeads: convOnDay,
    });
  }

  return result;
};

export const getLeadSources = async () => {
  const sourcesCount: Record<string, number> = {
    'Website Contact Form': 0,
    'Referral': 0,
    'Social Media': 0,
    'Advertisement': 0,
    'Other': 0,
  };

  memoryStore.leads.forEach((l) => {
    const src = l.source || 'Other';
    if (sourcesCount[src] !== undefined) {
      sourcesCount[src]++;
    } else {
      sourcesCount['Other']++;
    }
  });

  const total = memoryStore.leads.length || 1;

  return Object.entries(sourcesCount).map(([source, count]) => ({
    source,
    count,
    percentage: Math.round((count / total) * 100),
  }));
};
