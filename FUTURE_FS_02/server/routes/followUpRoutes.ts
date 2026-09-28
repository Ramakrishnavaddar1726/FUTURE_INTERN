import { Router } from 'express';
import {
  getFollowUps,
  updateFollowUp,
  toggleFollowUpComplete,
  deleteFollowUp,
} from '../controllers/followUpController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, getFollowUps);
router.put('/:id', protect, updateFollowUp);
router.patch('/:id/complete', protect, toggleFollowUpComplete);
router.delete('/:id', protect, deleteFollowUp);

export default router;
