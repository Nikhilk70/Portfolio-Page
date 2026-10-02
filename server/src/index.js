import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import portfolioRoutes from './routes/portfolio.routes.js';
import contactRoutes from './routes/contact.routes.js';
import { getDataSource } from './services/data.service.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*';

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
  res.json({
    name: 'Nikhil K K Portfolio API',
    version: '2.0.0',
    endpoints: [
      'GET /api/health',
      'GET /api/portfolio',
      'GET /api/profile',
      'GET /api/socials',
      'GET /api/stats',
      'GET /api/marquee',
      'GET /api/hero-cards',
      'GET /api/skills',
      'GET /api/services',
      'GET /api/experience',
      'GET /api/projects',
      'GET /api/projects/:slug',
      'GET /api/education',
      'GET /api/certificates',
      'POST /api/contact',
    ],
  });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', dataSource: getDataSource() ?? 'not loaded yet', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.use('/api', portfolioRoutes);
app.use('/api/contact', contactRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✔ Portfolio API running on http://localhost:${PORT}`);
});
