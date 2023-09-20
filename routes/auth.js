import express from 'express';
import {
  signup,
  signin,
  getMe,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router
  .post('/signup', signup)
  .post('/signin', signin)
  .post('/forgot-password', forgotPassword)
  .put('/reset-password/:resettoken', resetPassword)
  .post('/me', protect, getMe);

export default router;
