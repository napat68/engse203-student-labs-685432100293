import userRoutes from './routes/userRoutes.js';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'node:path';

import { config } from './config.js';
import requestRoutes from './routes/requestRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  // CORS
  app.use(cors({ origin: config.corsOrigin }));

  // Logging
  app.use(morgan(config.isProd ? 'combined' : 'dev'));

  // JSON body parser
  app.use(express.json());

  // Development API homepage
  if (!config.isProd) {
    app.get('/', (req, res) => {
      res.json({
        message: 'Campus Service API is running',
        version: '2.0.0',
      });
    });
  }

  // API routes
  app.use('/api/health', healthRoutes);
  app.use('/api/requests', requestRoutes);
  app.use('/api/users', userRoutes);

  // Production: Serve React frontend
  if (config.isProd) {
    app.use(express.static(config.staticDir));

    // SPA fallback
    app.use((req, res, next) => {
      if (req.method === 'GET' && !req.path.startsWith('/api/')) {
        return res.sendFile(path.join(config.staticDir, 'index.html'));
      }

      next();
    });
  }

  // Error handling
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
