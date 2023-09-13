/*
Controller: bootcamps
*/
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';
import Bootcamp from '../models/Bootcamp.js';
/*
@desc: Get all bootcamps information
@Author: Pawel Borkar
@route: GET /api/v1/bootcamps
@access: Public
*/
const getAllBootcamps = asyncHandler(async (req, res, next) => {
  const allBootcamps = await Bootcamp.find();
  res
    .status(200)
    .json({ success: true, count: allBootcamps.length, data: allBootcamps });
});

/*
@desc: Get all bootcamps information
@Author: Pawel Borkar
@route: GET /api/v1/bootcamps/:id
@access: Public
*/
const getSingleBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with an id of ${req.params.id}`,
        404
      )
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

/*
@desc: Add a new bootcamp
@Author: Pawel Borkar
@route: POST /api/v1/bootcamp
@access: Private
*/
const createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

/*
@desc: Update a bootcamp
@Author: Pawel Borkar
@route: PUT /api/v1/bootcamp/:id
@access: Private
*/
const updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with an id of ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

/*
@desc: Delete a bootcamp from catalogue
@Author: Pawel Borkar
@route: DELETE /api/v1/bootcamp/:id
@access: Private
*/
const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with an id of ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

export {
  getAllBootcamps,
  getSingleBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
};
