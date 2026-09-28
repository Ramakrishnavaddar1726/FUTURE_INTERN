import { Request, Response } from 'express';
import { getNotesByLeadId, createNote as createNoteInStore, updateNote as updateNoteInStore, deleteNote as deleteNoteInStore } from '../storage/store.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

// @desc Get all notes for a specific lead
// @route GET /api/leads/:id/notes
export const getLeadNotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const notes = await getNotesByLeadId(id);
    res.status(200).json({
      success: true,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve notes',
      error: (error as Error).message,
    });
  }
};

// @desc Create note for lead
// @route POST /api/leads/:id/notes
export const createLeadNote = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      res.status(400).json({ success: false, message: 'Note content cannot be empty.' });
      return;
    }

    const createdBy = req.user?.name || 'Admin User';
    const note = await createNoteInStore(id, content, createdBy);

    res.status(201).json({
      success: true,
      message: 'Note added successfully.',
      data: note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add note',
      error: (error as Error).message,
    });
  }
};

// @desc Update note
// @route PUT /api/notes/:id
export const updateNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      res.status(400).json({ success: false, message: 'Note content cannot be empty.' });
      return;
    }

    const updated = await updateNoteInStore(id, content);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Note not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Note updated successfully.',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update note',
      error: (error as Error).message,
    });
  }
};

// @desc Delete note
// @route DELETE /api/notes/:id
export const deleteNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await deleteNoteInStore(id);

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Note not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete note',
      error: (error as Error).message,
    });
  }
};
