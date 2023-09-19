import express from 'express';
import {
  getAllBootcamps,
  getSingleBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsWithinRadius,
  bootcampUploadPhoto,
} from '../controllers/bootcamps.js';

// Include other resource routers
import courseRouter from './courses.js';
import advancedResults from '../middleware/advancedResults.js';
import Bootcamp from '../models/Bootcamp.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Re-routing to the resource
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius').get(getBootcampsWithinRadius);
router
  .route('/')
  .get(
    advancedResults(Bootcamp, {
      path: 'courses',
      select: 'title description weeks tuition level',
    }),
    getAllBootcamps
  )
  .post(protect, authorize, createBootcamp);

router.route('/:id/photo').put(protect, authorize, bootcampUploadPhoto);

router
  .route('/:id')
  .get(getSingleBootcamp)
  .delete(protect, authorize, deleteBootcamp)
  .put(protect, authorize, updateBootcamp);

export default router;
