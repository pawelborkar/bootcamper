/*
Controller: bootcamps
*/
import path from 'node:path';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';
import Bootcamp from '../models/Bootcamp.js';
import geocoder from '../utils/geocoder.js';

/*
@desc: Get all bootcamps information
@Author: Pawel Borkar
@route: GET /api/v1/bootcamps
@access: Public
*/
const getAllBootcamps = asyncHandler(async (req, res) => {
  res.status(200).json(res.advancedResults);
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
  // Add user to req.body
  req.body.user = req.user.id;

  // Check for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  // If the user is not an admin, they can add only one bootcamp.
  if (publishedBootcamp && req.user.role != 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID: ${req.user.id} has already published a bootcamp. In order to add more upgrade your role to admin.`,
        400
      )
    );
  }

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
  let bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with an id of ${req.params.id}`,
        404
      )
    );
  }

  // Make sure user is the bootcamp owner.
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this bootcamp.`,
        401
      )
    );
  }

  bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: bootcamp });
});

/*
@desc: Delete a bootcamp from catalogue
@Author: Pawel Borkar
@route: DELETE /api/v1/bootcamp/:id
@access: Private
*/
const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with an id of ${req.params.id}`,
        404
      )
    );
  }

  // Make sure user is the bootcamp owner.
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this bootcamp.`,
        401
      )
    );
  }

  bootcamp.remove(); // Removes bootcamp and all associated courses from database.

  res.status(200).json({ success: true, data: bootcamp });
});

/*
@desc: Get bootcamps within a radius
@Author: Pawel Borkar
@route: GET /api/v1/bootcamp/radius/:zipcode/:distance/:unit
@access: Private
*/
const getBootcampsWithinRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance, unit } = req.body;

  const displayUnit = unit === 'miles' ? 3963 : 6378;

  // Get the latitude and longitude from geocoder
  const loc = await geocoder.geocode(zipcode);
  const latitude = loc[0].latitude;
  const longitude = loc[0].longitude;

  const radius = distance / displayUnit;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
    },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

/*
@desc: Upload photo for the bootcamp
@Author: Pawel Borkar
@route: PUT /api/v1/bootcamps/:bootcampId/photo
@access: Private
*/
const bootcampUploadPhoto = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with an id of ${req.params.id}`,
        404
      )
    );
  }

  // Make sure user is the bootcamp owner.
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to upl;oad photo and update this bootcamp.`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  const file = req.files.file;

  if (!file.mimetype.startsWith('image')) {
    return next(
      new ErrorResponse(`Please upload an image of type jpg, jpeg or png`, 400)
    );
  }

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD_SIZE) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${
          process.env.MAX_FILE_UPLOAD_SIZE / (1024 * 1024)
        } MB`,
        400
      )
    );
  }

  // Create custom file name for uniqueness
  file.name = `img-${file.name.split('.')[0]}-${Date.now()}${
    path.parse(file.name).ext
  }`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Something went wrong.`, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
  });

  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully.',
  });
});

export {
  getAllBootcamps,
  getSingleBootcamp,
  getBootcampsWithinRadius,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  bootcampUploadPhoto,
};
