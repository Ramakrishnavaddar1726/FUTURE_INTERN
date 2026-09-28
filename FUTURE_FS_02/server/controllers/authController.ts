import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findAdminByEmail, findAdminById, updateAdminPassword, updateAdminProfile } from '../storage/store.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

const JWT_SECRET = process.env.JWT_SECRET || 'leadpulse-crm-jwt-secret-key-2026';

const generateToken = (id: string, email: string) => {
  return jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '7d' });
};

// @desc Auth admin & get token
// @route POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: 'Please provide both email and password.',
    });
    return;
  }

  const admin = await findAdminByEmail(email);

  if (!admin) {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials. No admin account found with this email.',
    });
    return;
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials. Incorrect password provided.',
    });
    return;
  }

  const token = generateToken(admin._id || admin.id, admin.email);

  res.status(200).json({
    success: true,
    message: 'Authentication successful. Welcome back!',
    token,
    user: {
      id: admin._id || admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  });
};

// @desc Logout admin (clears client session)
// @route POST /api/auth/logout
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

// @desc Get current admin profile
// @route GET /api/auth/me
export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  const admin = await findAdminById(req.user.id);
  if (!admin) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }

  res.status(200).json({
    success: true,
    user: {
      id: admin._id || admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      createdAt: admin.createdAt,
    },
  });
};

// @desc Update admin profile
// @route PUT /api/auth/profile
export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  const { name, email } = req.body;

  if (!name || !email) {
    res.status(400).json({ success: false, message: 'Name and email are required.' });
    return;
  }

  const updated = await updateAdminProfile(req.user.id, name, email);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: {
      id: updated._id || updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
    },
  });
};

// @desc Change admin password
// @route PUT /api/auth/change-password
export const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400).json({
      success: false,
      message: 'Both current password and new password are required.',
    });
    return;
  }

  if (newPassword.length < 6) {
    res.status(400).json({
      success: false,
      message: 'New password must be at least 6 characters long.',
    });
    return;
  }

  const admin = await findAdminById(req.user.id);
  if (!admin) {
    res.status(404).json({ success: false, message: 'Admin not found' });
    return;
  }

  const isMatch = await bcrypt.compare(currentPassword, admin.password);
  if (!isMatch) {
    res.status(400).json({ success: false, message: 'Current password does not match.' });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const newHashedPassword = await bcrypt.hash(newPassword, salt);
  await updateAdminPassword(req.user.id, newHashedPassword);

  res.status(200).json({
    success: true,
    message: 'Password changed successfully.',
  });
};
