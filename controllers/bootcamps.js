/*
Controller: bootcamps
*/
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
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };
  console.log('Req Query: ', reqQuery);

  // Remove fields
  const removeFields = ['select', 'sort'];

  // Loop overs removefields array and deletes them from the query
  removeFields.forEach((param) => delete reqQuery[param]);

  // String maninpulation in order to format the query string from the params in the mongodb acceptable manner for more visit: https://www.mongodb.com/docs/manual/reference/operator/query/gte/#mongodb-query-op.-gte
  let queryString = JSON.stringify(reqQuery); // Create query string

  // Create operators for gt, gte, lt, lte and in
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g, // regex for greater than, greater than equal to, less than, less than equal to and in
    (match) => `$${match}`
  );

  queryString = JSON.parse(queryString);
  // Finding the resource in the database
  query = Bootcamp.find(queryString);

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
    // console.log('SORT', query);
  } else {
    query = query.sort('-createdAt');
  }

  // Execute the query
  const allBootcamps = await query;

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

/*
@desc: Get bootcamps within a radius
@Author: Pawel Borkar
@route: DELETE /api/v1/bootcamp/radius/:zipcode/:distance/:unit
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

export {
  getAllBootcamps,
  getSingleBootcamp,
  getBootcampsWithinRadius,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
};
