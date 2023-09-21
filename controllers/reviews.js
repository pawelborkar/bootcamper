import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';
import Review from '../models/Review.js';
import Bootcamp from '../models/Bootcamp.js';

/*
@desc: Get all courses for a specific bootcamp
@Author: Pawel Borkar
@route: GET /api/v1/reviews
@route: GET /api/v1/bootcamps/bootcampId/reviews
@access: Public
*/
const getReviews = asyncHandler(async (req, res) => {
  // Checking courses for a single bootcamp
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });

    // Returns available courses for asked single bootcamp
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    // Returning all the courses available at the platform
    res.status(200).json(res.advancedResults);
  }
});

export { getReviews };
