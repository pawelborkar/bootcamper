import express from 'express';
import {
  addReview,
  deleteReview,
  getAllReviews,
  getSingleReview,
  updateReview,
} from '../controllers/reviews.js';
import Review from '../models/Review.js';
import { protect, isUser } from '../middleware/auth.js';
import advancedResults from '../middleware/advancedResults.js';

const router = express.Router({ mergeParams: true });
router
  .route('/')
  .get(
    advancedResults(Review, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getAllReviews
  )
  .post(protect, isUser, addReview);

router
  .route('/:id')
  .get(getSingleReview)
  .put(protect, isUser, updateReview)
  .delete(protect, isUser, deleteReview);
export default router;
