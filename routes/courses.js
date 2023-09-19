import express from 'express';
import {
  createCourse,
  deleteCourse,
  getCourse,
  getCourses,
  updateCourse,
} from '../controllers/courses.js';
import Course from '../models/Course.js';
import { protect, authorize } from '../middleware/auth.js';
import advancedResults from '../middleware/advancedResults.js';

const router = express.Router({ mergeParams: true });
router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getCourses
  )
  .post(protect, authorize, createCourse);

router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize, updateCourse)
  .delete(protect, authorize, deleteCourse);

export default router;
