import { Request, Response } from 'express';
import {
  supabase,
  testSupabaseConnection,
  syncLeadToSupabase,
  SUPABASE_PROJECT_ID,
  SUPABASE_URL,
} from '../config/supabase.js';
import { getLeads } from '../storage/store.js';

// @desc Get Supabase connection status & configuration details
// @route GET /api/supabase/status
export const getSupabaseStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const status = await testSupabaseConnection();
    res.status(200).json({
      success: true,
      ...status,
      sqlSchema: {
        appointments: `CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  service text,
  notes text,
  appointment_date text,
  appointment_time text,
  date text,
  time text,
  status text DEFAULT 'Pending',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) or grant public write access:
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous appointment booking" ON public.appointments
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read of appointments" ON public.appointments
  FOR SELECT USING (true);`,

        leads: `CREATE TABLE IF NOT EXISTS public.leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  service text,
  message text,
  source text DEFAULT 'Website Appointment Booking Form',
  status text DEFAULT 'New',
  priority text DEFAULT 'Medium',
  follow_up_date text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) or grant public write access:
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous lead submission" ON public.leads
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read of leads" ON public.leads
  FOR SELECT USING (true);`,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to query Supabase status',
      error: (error as Error).message,
    });
  }
};

// @desc Test inserting a sample appointment into Supabase
// @route POST /api/supabase/test-insert
export const testInsertSupabase = async (req: Request, res: Response): Promise<void> => {
  try {
    const testAppointment = {
      name: req.body.name || 'Alex Morgan (Supabase Test)',
      email: req.body.email || 'alex.morgan@example.com',
      phone: req.body.phone || '+1 (555) 234-5678',
      company: req.body.company || 'Innovate AI Labs',
      service: req.body.service || 'Executive CRM Architecture Consultation',
      message: req.body.message || 'Testing live connection from appointment booking form to Supabase.',
      appointmentDate: req.body.appointmentDate || new Date().toISOString().split('T')[0],
      appointmentTime: req.body.appointmentTime || '02:00 PM',
      source: 'Supabase Integration Test',
      status: 'New',
    };

    const result = await syncLeadToSupabase(testAppointment);
    res.status(200).json({
      success: result.success,
      message: result.message,
      results: result.results,
      sampleData: testAppointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to test insert into Supabase',
      error: (error as Error).message,
    });
  }
};

// @desc Sync all existing leads to Supabase
// @route POST /api/supabase/sync-all
export const syncAllToSupabase = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await getLeads({ limit: 100 });
    const syncResults = [];

    for (const lead of data.leads) {
      const syncRes = await syncLeadToSupabase({
        id: lead._id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        service: lead.service,
        message: lead.message,
        source: lead.source,
        status: lead.status,
        priority: lead.priority,
        followUpDate: lead.followUpDate,
        createdAt: lead.createdAt,
      });
      syncResults.push({ leadId: lead._id, name: lead.name, ...syncRes });
    }

    res.status(200).json({
      success: true,
      count: syncResults.length,
      syncedCount: syncResults.filter((r) => r.success).length,
      message: `Completed synchronization of ${syncResults.length} records to Supabase backend.`,
      records: syncResults,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to batch sync records to Supabase',
      error: (error as Error).message,
    });
  }
};
