import { Request, Response } from 'express';
import {
  getFollowUps as getFollowUpsInStore,
  createFollowUp as createFollowUpInStore,
  updateFollowUp as updateFollowUpInStore,
  toggleFollowUpComplete as toggleFollowUpCompleteInStore,
  deleteFollowUp as deleteFollowUpInStore,
} from '../storage/store.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

// @desc Get followups with optional filters (leadId, status)
// @route GET /api/followups
export const getFollowUps = async (req: Request, res: Response): Promise<void> => {
  try {
    const { leadId, status } = req.query;
    const followups = await getFollowUpsInStore({
      leadId: leadId as string,
      status: status as string,
    });

    res.status(200).json({
      success: true,
      data: followups,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve follow-ups',
      error: (error as Error).message,
    });
  }
};

// @desc Create follow-up for a lead
// @route POST /api/leads/:id/followups
export const createLeadFollowUp = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { date, time, description, priority, leadName } = req.body;

    if (!date) {
      res.status(400).json({ success: false, message: 'Follow-up date is required.' });
      return;
    }

    if (!description || !description.trim()) {
      res.status(400).json({ success: false, message: 'Follow-up description is required.' });
      return;
    }

    const createdBy = req.user?.name || 'Admin User';
    const followUp = await createFollowUpInStore({
      leadId: id,
      leadName,
      date,
      time: time || '10:00 AM',
      description: description.trim(),
      priority: priority || 'Medium',
      createdBy,
    });

    res.status(201).json({
      success: true,
      message: 'Follow-up scheduled successfully.',
      data: followUp,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create follow-up',
      error: (error as Error).message,
    });
  }
};

// @desc Update follow-up
// @route PUT /api/followups/:id
export const updateFollowUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { date, time, description, priority, status } = req.body;

    const updated = await updateFollowUpInStore(id, {
      date,
      time,
      description,
      priority,
      status,
    });

    if (!updated) {
      res.status(404).json({ success: false, message: 'Follow-up not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Follow-up updated successfully.',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update follow-up',
      error: (error as Error).message,
    });
  }
};

// @desc Toggle or mark follow-up as completed
// @route PATCH /api/followups/:id/complete
export const toggleFollowUpComplete = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await toggleFollowUpCompleteInStore(id);

    if (!updated) {
      res.status(404).json({ success: false, message: 'Follow-up not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Follow-up marked as ${updated.status}.`,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update follow-up status',
      error: (error as Error).message,
    });
  }
};

// @desc Delete follow-up
// @route DELETE /api/followups/:id
export const deleteFollowUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await deleteFollowUpInStore(id);

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Follow-up not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Follow-up deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete follow-up',
      error: (error as Error).message,
    });
  }
};
