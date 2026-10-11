import { Router } from 'express';
import { config } from '../config.js';
import { getDbStatus } from '../services/requestService.js';

const router = Router();

router.get('/', (req, res) => {
  const database = getDbStatus();
  const healthy = database.connected;

  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'error',
    env: config.env,
    uptime: process.uptime(),
    database,
    time: new Date().toISOString(),
  });
});

export default router;