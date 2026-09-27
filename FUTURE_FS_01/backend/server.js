/**
 * Ramakrishna Portfolio - Backend Express Server
 * Handles /api/contact and MongoDB persistence
 */
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Body Parsers & Security Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Ramakrishna Portfolio API',
  });
});

// Mount Contact Routes
app.use('/api/contact', require('./routes/contactRoutes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Server] Portfolio backend running on port ${PORT}`);
  });
}

module.exports = app;
