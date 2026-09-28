import { Router } from 'express';
import {
  getAllLeads,
  getLead,
  createLead,
  updateLead,
  updateLeadStatus,
  deleteLead,
} from '../controllers/leadController.js';
import { getLeadNotes, createLeadNote } from '../controllers/noteController.js';
import { createLeadFollowUp } from '../controllers/followUpController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Public route for landing page contact form submission, admin can also submit
router.post('/', createLead);

// Protected routes for CRM admin
router.get('/', protect, getAllLeads);
router.get('/:id', protect, getLead);
router.put('/:id', protect, updateLead);
router.patch('/:id/status', protect, updateLeadStatus);
router.delete('/:id', protect, deleteLead);

// Nested routes for lead notes
router.get('/:id/notes', protect, getLeadNotes);
router.post('/:id/notes', protect, createLeadNote);

// Nested route for lead follow-ups
router.post('/:id/followups', protect, createLeadFollowUp);

export default router;
