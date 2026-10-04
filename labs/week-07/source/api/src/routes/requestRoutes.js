import { asyncHandler } from '../middleware/asyncHandler.js';
import { Router } from 'express';
import * as controller from '../controllers/requestController.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    return controller.listRequests(req, res, next);
  })
);

router.post('/', validateRequest, controller.createRequest);
router.get('/:id', controller.getRequest);
router.put('/:id', controller.updateRequestStatus);
router.delete('/:id', controller.deleteRequest);

export default router;
