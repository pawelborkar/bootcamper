import express from 'express';
import { getMe, signin, signup } from '../controllers/auth.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router
  .post('/signup', signup)
  .post('/signin', signin)
  .post('/me', protect, getMe);

export default router;
