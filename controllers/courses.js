import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';
import Course from '../models/Course.js';

/*
@desc: Get all courses for a specific bootcamp
@route: GET /api/v1/courses
@route: GET /api/v1/bootcamps/bootcampId/courses
@access: Public
*/

const getCourses = asyncHandler(async (req, res, next) => {
  // Building query
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description',
    });
  }

  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

export { getCourses };
