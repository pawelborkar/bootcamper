import express from 'express';
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/users.js';
import User from '../models/User.js';
import { protect, isAdmin } from '../middleware/auth.js';
import advancedResults from '../middleware/advancedResults.js';

const router = express.Router(protect, isAdmin);
// // All routes below these two lines will contain the protect and authorize middleware in them
// router.use(protect);
// router.use(authorize);

router.route('/').get(advancedResults(User), getAllUsers).post(createUser);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

export default router;
