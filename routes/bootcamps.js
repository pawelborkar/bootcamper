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

const router = express.Router();

// Re-routing to the resource
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius').get(getBootcampsWithinRadius);
router.route('/').get(getAllBootcamps).post(createBootcamp);

router.route('/:id/photo').put(bootcampUploadPhoto);

router
  .route('/:id')
  .get(getSingleBootcamp)
  .delete(deleteBootcamp)
  .put(updateBootcamp);

export default router;
