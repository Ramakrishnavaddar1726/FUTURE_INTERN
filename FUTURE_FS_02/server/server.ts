import app from './app.js';
import path from 'path';
import express from 'express';

const PORT = process.env.PORT || 3000;

// In production standalone mode, serve Vite built assets
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[LeadPulse CRM Server] Running on http://localhost:${PORT}`);
});
