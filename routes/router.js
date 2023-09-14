import express from 'express';
import {
  getAllBootcamps,
  getSingleBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsWithinRadius,
} from '../controllers/bootcamps.js';

const router = express.Router();

router.route('/radius').get(getBootcampsWithinRadius);
router.route('/').get(getAllBootcamps).post(createBootcamp);

router
  .route('/:id')
  .get(getSingleBootcamp)
  .delete(deleteBootcamp)
  .put(updateBootcamp);

export default router;
