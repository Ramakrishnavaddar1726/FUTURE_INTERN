import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import followUpRoutes from './routes/followUpRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import supabaseRoutes from './routes/supabaseRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { initStorage } from './storage/store.js';
import { connectDB } from './config/db.js';

dotenv.config();

const app = express();

// Initialize DB and Storage
connectDB().catch((err) => console.log('MongoDB connection notice:', err.message));
initStorage().catch((err) => console.log('Local store notice:', err.message));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'LeadPulse CRM API', timestamp: new Date().toISOString() });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/followups', followUpRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/supabase', supabaseRoutes);

// Error Handling
app.use(errorHandler);

export default app;
