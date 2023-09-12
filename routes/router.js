import express from 'express';
import {
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
} from '../controllers/bootcamps.js';

const router = express.Router()

router.route('/').get(getBootcamps).post(createBootcamp);

router
  .route('/:id')
  .get(getBootcamps)
  .delete(deleteBootcamp)
  .put(updateBootcamp);

export default router;
