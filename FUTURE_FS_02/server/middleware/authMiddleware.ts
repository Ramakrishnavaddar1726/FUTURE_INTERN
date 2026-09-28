import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { findAdminById } from '../storage/store.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'leadpulse-crm-jwt-secret-key-2026';

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: Access denied. Please provide a valid authorization token.',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    const admin = await findAdminById(decoded.id);

    if (!admin) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: User account associated with this token no longer exists.',
      });
      return;
    }

    req.user = {
      id: admin._id || admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: Token is invalid or expired. Please sign in again.',
    });
  }
};
