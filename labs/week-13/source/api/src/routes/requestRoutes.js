import { Router } from 'express';
import * as controller from '../controllers/requestController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

// GET และ POST — ผู้ใช้ทั่วไปเข้าถึงได้
router.get('/', controller.listRequests);
router.post('/', validateRequest, controller.createRequest);
router.get('/:id', controller.getRequest);

// CP51 — PUT และ DELETE เฉพาะเจ้าหน้าที่เท่านั้น
router.put(
  '/:id',
  authenticate,
  requireRole('staff'),
  controller.updateRequestStatus
);

router.delete(
  '/:id',
  authenticate,
  requireRole('staff'),
  controller.deleteRequest
);

export default router;