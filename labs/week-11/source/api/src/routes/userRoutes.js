
import { Router } from 'express';
import { findAllUsers } from '../services/requestService.js';

const router = Router();

router.get('/', (req, res, next) => {
  try {
    const users = findAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

export default router;
