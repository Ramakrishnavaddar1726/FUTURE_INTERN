import { Router } from 'express';
import { updateNote, deleteNote } from '../controllers/noteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.put('/:id', protect, updateNote);
router.delete('/:id', protect, deleteNote);

export default router;
