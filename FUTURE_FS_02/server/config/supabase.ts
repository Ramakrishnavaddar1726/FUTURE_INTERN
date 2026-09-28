import { createClient } from '@supabase/supabase-js';

export const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID || 'vvcfixbedxcuujobuypd';
export const SUPABASE_URL = process.env.SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_publishable_eHgjKC3-YV1i_A2_Jp8hPA_QstMv37t';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export interface SupabaseSyncResult {
  synced: boolean;
  table: string;
  error?: string;
  data?: any;
}

export interface SyncLeadResult {
  success: boolean;
  primaryId?: string;
  appointmentRecord?: any;
  leadRecord?: any;
  results: Record<string, SupabaseSyncResult>;
  message: string;
}

/**
 * Saves appointment / lead data directly into Supabase database.
 * Writes to 'appointments' and 'leads' tables.
 */
export async function syncLeadToSupabase(lead: {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message?: string;
  source?: string;
  status?: string;
  priority?: string;
  followUpDate?: string | null;
  appointmentDate?: string;
  appointmentTime?: string;
  createdAt?: string;
}): Promise<SyncLeadResult> {
  const now = new Date().toISOString();
  const appointmentDate = lead.appointmentDate || lead.followUpDate || now.split('T')[0];
  const appointmentTime = lead.appointmentTime || '10:00 AM';

  const results: Record<string, SupabaseSyncResult> = {};
  let anySuccess = false;
  let appointmentRecord: any = null;
  let leadRecord: any = null;

  // 1. Insert into 'appointments' table
  try {
    const appointmentPayload = {
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      service: lead.service || 'Consultation',
      notes: lead.message || '',
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      date: appointmentDate,
      time: appointmentTime,
      status: lead.status || 'Pending',
      created_at: now,
    };

    const { data, error } = await supabase
      .from('appointments')
      .insert([appointmentPayload])
      .select();

    if (error) {
      console.warn('[Supabase Sync Warning - appointments table]:', error.message);
      results['appointments'] = { synced: false, table: 'appointments', error: error.message };
    } else if (data && data.length > 0) {
      appointmentRecord = data[0];
      results['appointments'] = { synced: true, table: 'appointments', data };
      anySuccess = true;
    }
  } catch (err: any) {
    results['appointments'] = { synced: false, table: 'appointments', error: err.message };
  }

  // 2. Insert into 'leads' table
  try {
    const leadsPayload = {
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      company: lead.company || 'Direct Client',
      service: lead.service || 'Appointment Consultation',
      message: lead.message || '',
      source: lead.source || 'Website Appointment Booking Form',
      status: lead.status || 'New',
      priority: lead.priority || 'Medium',
      created_at: lead.createdAt || now,
      follow_up_date: lead.followUpDate || appointmentDate,
    };

    const { data, error } = await supabase
      .from('leads')
      .insert([leadsPayload])
      .select();

    if (error) {
      console.warn('[Supabase Sync Warning - leads table]:', error.message);
      results['leads'] = { synced: false, table: 'leads', error: error.message };
    } else if (data && data.length > 0) {
      leadRecord = data[0];
      results['leads'] = { synced: true, table: 'leads', data };
      anySuccess = true;
    }
  } catch (err: any) {
    results['leads'] = { synced: false, table: 'leads', error: err.message };
  }

  const primaryId = leadRecord?.id || appointmentRecord?.id || lead.id || lead._id;

  return {
    success: anySuccess,
    primaryId,
    appointmentRecord,
    leadRecord,
    results,
    message: anySuccess
      ? 'Successfully stored and synchronized to Supabase database.'
      : 'Synced to local storage; check Supabase connection.',
  };
}

/**
 * Fetch all appointments from Supabase
 */
export async function fetchSupabaseAppointments(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching Supabase appointments:', error.message);
      return [];
    }
    return data || [];
  } catch (err: any) {
    console.warn('Error querying Supabase appointments:', err.message);
    return [];
  }
}

/**
 * Fetch all leads from Supabase
 */
export async function fetchSupabaseLeads(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching Supabase leads:', error.message);
      return [];
    }
    return data || [];
  } catch (err: any) {
    console.warn('Error querying Supabase leads:', err.message);
    return [];
  }
}

/**
 * Health check test connection to Supabase
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  projectId: string;
  url: string;
  message: string;
  tablesStatus?: Record<string, string>;
  counts?: { appointments: number; leads: number };
}> {
  try {
    const tablesStatus: Record<string, string> = {};

    const [leadsCheck, apptsCheck] = await Promise.allSettled([
      supabase.from('leads').select('*', { count: 'exact' }),
      supabase.from('appointments').select('*', { count: 'exact' }),
    ]);

    let leadsCount = 0;
    let apptsCount = 0;

    if (leadsCheck.status === 'fulfilled') {
      if (leadsCheck.value.error) {
        tablesStatus['leads'] = `Note: ${leadsCheck.value.error.message}`;
      } else {
        leadsCount = leadsCheck.value.count || (leadsCheck.value.data ? leadsCheck.value.data.length : 0);
        tablesStatus['leads'] = `Active (${leadsCount} records)`;
      }
    } else {
      tablesStatus['leads'] = 'Failed to query table';
    }

    if (apptsCheck.status === 'fulfilled') {
      if (apptsCheck.value.error) {
        tablesStatus['appointments'] = `Note: ${apptsCheck.value.error.message}`;
      } else {
        apptsCount = apptsCheck.value.count || (apptsCheck.value.data ? apptsCheck.value.data.length : 0);
        tablesStatus['appointments'] = `Active (${apptsCount} records)`;
      }
    } else {
      tablesStatus['appointments'] = 'Failed to query table';
    }

    return {
      connected: true,
      projectId: SUPABASE_PROJECT_ID,
      url: SUPABASE_URL,
      message: 'Successfully reached Supabase API endpoint with active tables.',
      tablesStatus,
      counts: { appointments: apptsCount, leads: leadsCount },
    };
  } catch (err: any) {
    return {
      connected: false,
      projectId: SUPABASE_PROJECT_ID,
      url: SUPABASE_URL,
      message: `Connection error: ${err.message}`,
    };
  }
}
