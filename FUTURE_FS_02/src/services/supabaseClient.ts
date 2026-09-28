import { createClient } from '@supabase/supabase-js';

export const SUPABASE_PROJECT_ID = 'vvcfixbedxcuujobuypd';
export const SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_eHgjKC3-YV1i_A2_Jp8hPA_QstMv37t';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export interface AppointmentBookingPayload {
  name: string;
  email: string;
  phone: string;
  service: string;
  company?: string;
  message?: string;
  appointmentDate?: string;
  appointmentTime?: string;
}

/**
 * Direct client-side insertion into Supabase tables 'appointments' and 'leads'
 */
export async function directSupabaseAppointmentBooking(payload: AppointmentBookingPayload) {
  const now = new Date().toISOString();
  const dateVal = payload.appointmentDate || now.split('T')[0];
  const timeVal = payload.appointmentTime || '10:00 AM';

  const appointmentRecord = {
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone.trim(),
    service: payload.service || 'Consultation',
    notes: payload.message?.trim() || '',
    appointment_date: dateVal,
    appointment_time: timeVal,
    date: dateVal,
    time: timeVal,
    status: 'Pending',
    created_at: now,
  };

  const leadRecord = {
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone.trim(),
    company: payload.company?.trim() || 'Direct Client',
    service: payload.service || 'Appointment Consultation',
    message: payload.message?.trim() || `Booked appointment for ${dateVal} at ${timeVal}`,
    source: 'Website Appointment Booking Form',
    status: 'New',
    priority: 'High',
    created_at: now,
    follow_up_date: dateVal,
  };

  const results: { appointments?: any; leads?: any; errors: string[] } = {
    errors: [],
  };

  // Attempt write to 'appointments'
  try {
    const { data, error } = await supabase.from('appointments').insert([appointmentRecord]).select();
    if (error) {
      results.errors.push(`appointments table: ${error.message}`);
    } else {
      results.appointments = data;
    }
  } catch (err: any) {
    results.errors.push(`appointments table: ${err.message}`);
  }

  // Attempt write to 'leads'
  try {
    const { data, error } = await supabase.from('leads').insert([leadRecord]).select();
    if (error) {
      results.errors.push(`leads table: ${error.message}`);
    } else {
      results.leads = data;
    }
  } catch (err: any) {
    results.errors.push(`leads table: ${err.message}`);
  }

  return results;
}
