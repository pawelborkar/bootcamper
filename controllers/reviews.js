import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';
import Review from '../models/Review.js';
import Bootcamp from '../models/Bootcamp.js';

/*
@desc: Get all reviews 
@Author: Pawel Borkar
@route: GET /api/v1/reviews
@route: GET /api/v1/bootcamps/bootcampId/reviews
@access: Public
*/
const getAllReviews = asyncHandler(async (req, res) => {
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

/*
@desc: Get a single review
@Author: Pawel Borkar
@route: GET /api/v1/reviews
@route: GET /api/v1/reviews/:id
@access: Public
*/
const getSingleReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with an id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: review,
  });
});

/*
@desc: Add review
@Author: Pawel Borkar
@route: POST /api/v1/bootcamps/:bootcampId/reviews
@access: Private
*/
const addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId; // for adding bootcamp id into the Course model
  req.body.user = req.user.id;
  req.body.username = req.user.username;
  // Check if the bootcamp with the required id is present in the database or not before adding a new course to it.
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with an id of ${req.params.id}`,
        404
      )
    );
  }

  // Add a course into the bootcamp
  const review = await Review.create(req.body);
  res.status(201).json({
    success: true,
    data: review,
  });
});

/*
@desc: Update a review
@Author: Pawel Borkar
@route: PUT /api/v1/reviews/:id
@access: Private
*/
const updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) {
    return next(
      new ErrorResponse(`Review not found with an id of ${req.params.id}`, 404)
    );
  }
  // Make sure user is the review owner.
  if (review.user.toString() !== req.user.id && req.user.role === 'publisher') {
    return next(
      new ErrorResponse(
        `User ${req.user.username} is not authorized to update the review with and id of:  ${review._id}.`,
        401
      )
    );
  }
  review = await Review.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: review });
});

/*
@desc: Delete review
@Author: Pawel Borkar
@route: DELETE /api/v1/bootcamp/:bootcampId/reviews/:id
@access: Private
*/
const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with an id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is the review owner.
  if (
    review?.user?.toString() !== req.user.id &&
    (req.user.role !== 'user' || req.user.role !== 'admin')
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.username} is not authorized to delete the review: ${review.title}.`,
        401
      )
    );
  }

  await review.remove();
  res
    .status(200)
    .json({ success: true, message: 'Review deleted successfully' });
});

export {
  getAllReviews,
  getSingleReview,
  addReview,
  updateReview,
  deleteReview,
};
