import { Router } from 'express';
import { getStats, getOverTime, getSources } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/stats', protect, getStats);
router.get('/leads-over-time', protect, getOverTime);
router.get('/lead-sources', protect, getSources);

export default router;
