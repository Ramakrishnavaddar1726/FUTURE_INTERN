import { Request, Response } from 'express';
import {
  getLeads,
  findLeadById,
  createLead as createLeadInStore,
  updateLead as updateLeadInStore,
  updateLeadStatus as updateStatusInStore,
  deleteLead as deleteLeadInStore,
  LeadFilterOptions,
} from '../storage/store.js';
import { syncLeadToSupabase } from '../config/supabase.js';

// @desc Get all leads with pagination, search, filters & sort
// @route GET /api/leads
export const getAllLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const options: LeadFilterOptions = {
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      search: req.query.search as string,
      status: req.query.status as string,
      source: req.query.source as string,
      priority: req.query.priority as string,
      dateRange: req.query.dateRange as string,
      sortBy: req.query.sortBy as string,
    };

    const data = await getLeads(options);
    res.status(200).json({
      success: true,
      data: data.leads,
      pagination: data.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve leads',
      error: (error as Error).message,
    });
  }
};

// @desc Get single lead by ID with notes and followups
// @route GET /api/leads/:id
export const getLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const lead = await findLeadById(id);

    if (!lead) {
      res.status(404).json({
        success: false,
        message: `Lead with ID ${id} not found.`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve lead details',
      error: (error as Error).message,
    });
  }
};

// @desc Create new lead (from public contact form or admin)
// @route POST /api/leads
export const createLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, company, service, message, source, status, priority, followUpDate, appointmentDate, appointmentTime } = req.body;

    // Field validations
    if (!name || !name.trim()) {
      res.status(400).json({ success: false, message: 'Full name is required.' });
      return;
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      res.status(400).json({ success: false, message: 'A valid email address is required.' });
      return;
    }

    if (!phone || !phone.trim()) {
      res.status(400).json({ success: false, message: 'Phone number is required.' });
      return;
    }

    if (!message || !message.trim()) {
      res.status(400).json({ success: false, message: 'Message or inquiry details are required.' });
      return;
    }

    const lead = await createLeadInStore({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      company: company ? company.trim() : 'Independent',
      service: service ? service.trim() : 'General Inquiry',
      message: message.trim(),
      source: source || 'Website Contact Form',
      status: status || 'New',
      priority: priority || 'Medium',
      followUpDate: followUpDate || appointmentDate || null,
    });

    // Synchronize directly with Supabase database (appointments & leads tables)
    let supabaseResult = null;
    try {
      supabaseResult = await syncLeadToSupabase({
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
        appointmentDate: appointmentDate,
        appointmentTime: appointmentTime,
        createdAt: lead.createdAt,
      });

      if (supabaseResult && supabaseResult.primaryId) {
        lead.id = supabaseResult.primaryId;
        lead._id = supabaseResult.primaryId;
        (lead as any).supabaseId = supabaseResult.primaryId;
      }
    } catch (sbErr) {
      console.warn('Supabase sync background notice:', (sbErr as Error).message);
    }

    res.status(201).json({
      success: true,
      message: 'Inquiry and appointment booking recorded successfully in database.',
      data: {
        ...lead,
        appointment_date: appointmentDate || lead.followUpDate,
        appointment_time: appointmentTime || '10:00 AM',
        supabaseRecord: supabaseResult?.appointmentRecord || supabaseResult?.leadRecord || lead,
      },
      supabase: {
        connected: !!supabaseResult?.success,
        projectId: 'vvcfixbedxcuujobuypd',
        primaryId: supabaseResult?.primaryId || lead.id,
        appointmentRecord: supabaseResult?.appointmentRecord || null,
        leadRecord: supabaseResult?.leadRecord || null,
        results: supabaseResult?.results || {},
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create lead',
      error: (error as Error).message,
    });
  }
};

// @desc Update existing lead
// @route PUT /api/leads/:id
export const updateLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, phone, company, service, message, source, status, priority, followUpDate } = req.body;

    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
      return;
    }

    const updated = await updateLeadInStore(id, {
      name,
      email,
      phone,
      company,
      service,
      message,
      source,
      status,
      priority,
      followUpDate,
    });

    if (!updated) {
      res.status(404).json({ success: false, message: 'Lead not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully.',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update lead',
      error: (error as Error).message,
    });
  }
};

// @desc Update lead status
// @route PATCH /api/leads/:id/status
export const updateLeadStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['New', 'Contacted', 'Converted'];
    if (!status || !allowed.includes(status)) {
      res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowed.join(', ')}`,
      });
      return;
    }

    const updated = await updateStatusInStore(id, status);

    if (!updated) {
      res.status(404).json({ success: false, message: 'Lead not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Lead status updated to ${status}.`,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update lead status',
      error: (error as Error).message,
    });
  }
};

// @desc Delete lead
// @route DELETE /api/leads/:id
export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await deleteLeadInStore(id);

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Lead not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Lead and associated records deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete lead',
      error: (error as Error).message,
    });
  }
};
