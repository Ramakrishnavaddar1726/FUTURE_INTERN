import { Router } from 'express';
import {
  getSupabaseStatus,
  testInsertSupabase,
  syncAllToSupabase,
} from '../controllers/supabaseController.js';

const router = Router();

router.get('/status', getSupabaseStatus);
router.post('/test-insert', testInsertSupabase);
router.post('/sync-all', syncAllToSupabase);

export default router;
