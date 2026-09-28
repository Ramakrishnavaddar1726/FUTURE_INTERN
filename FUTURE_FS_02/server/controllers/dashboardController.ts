import { Request, Response } from 'express';
import { getDashboardStats, getLeadsOverTime, getLeadSources } from '../storage/store.js';

// @desc Get high-level CRM stats (total, new, contacted, converted, pending followups, conversionRate)
// @route GET /api/dashboard/stats
export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await getDashboardStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard metrics',
      error: (error as Error).message,
    });
  }
};

// @desc Get leads created over time (7d or 30d)
// @route GET /api/dashboard/leads-over-time
export const getOverTime = async (req: Request, res: Response): Promise<void> => {
  try {
    const range = req.query.range === '7d' ? 7 : 30;
    const data = await getLeadsOverTime(range);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve timeline metrics',
      error: (error as Error).message,
    });
  }
};

// @desc Get lead sources breakdown
// @route GET /api/dashboard/lead-sources
export const getSources = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await getLeadSources();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve lead sources',
      error: (error as Error).message,
    });
  }
};
