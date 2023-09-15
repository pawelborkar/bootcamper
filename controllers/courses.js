import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';
import Course from '../models/Course.js';
import Bootcamp from '../models/Bootcamp.js';

/*
@desc: Get all courses for a specific bootcamp
@Author: Pawel Borkar
@route: GET /api/v1/courses
@route: GET /api/v1/bootcamps/bootcampId/courses
@access: Public
*/

const getCourses = asyncHandler(async (req, res) => {
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

/*
@desc: Get a single courses for a specific bootcamp
@Author: Pawel Borkar
@route: GET /api/v1/courses/:id
@route: GET /api/v1/bootcamps/bootcampId/courses/:id
@access: Public
*/

const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with an id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: course,
  });
});

/*
@desc: Add a new course
@Author: Pawel Borkar
@route: POST /api/v1/bootcamps/:bootcampId/courses
@access: Private
*/
const createCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId; // for adding bootcamp id into the Course model

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
  const course = await Course.create(req.body);
  res.status(201).json({
    success: true,
    data: course,
  });
});

/*
@desc: Update a course
@Author: Pawel Borkar
@route: PUT /api/v1/courses/:id
@access: Private
*/
const updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`Course not found with an id of ${req.params.id}`, 404)
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: course });
});

/*
@desc: Delete a course from a bootcamp
@Author: Pawel Borkar
@route: DELETE /api/v1/bootcamp/:bootcampId/courses/:id
@access: Private
*/
const deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with an id of ${req.params.id}`, 404)
    );
  }

  await course.remove();
  res
    .status(200)
    .json({ success: true, data: [], message: 'Course deleted successfully' });
});

export { getCourses, getCourse, createCourse, updateCourse, deleteCourse };
