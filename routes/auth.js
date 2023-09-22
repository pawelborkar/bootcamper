import express from 'express';
import {
  signup,
  signin,
  getMe,
  forgotPassword,
  resetPassword,
  updateUserDetails,
  updatePassword,
  logout,
} from '../controllers/auth.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router
  .post('/signup', signup)
  .post('/signin', signin)
  .get('/logout', logout)
  .post('/forgot-password', forgotPassword)
  .put('/reset-password/:resettoken', resetPassword)
  .post('/me', protect, getMe)
  .put('/update-details', protect, updateUserDetails)
  .put('/update-password', protect, updatePassword);

export default router;
