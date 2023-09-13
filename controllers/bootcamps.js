/*
Controller: bootcamps
*/

import Bootcamp from '../models/Bootcamp.js';
/*
@desc: Get all bootcamps information
@Author: Pawel Borkar
@route: GET /api/v1/bootcamps
@access: Public
*/
const getAllBootcamps = async (req, res) => {
  try {
    const allBootcamps = await Bootcamp.find();
    res.status(200).json({ success: true, count: allBootcamps.length,  data: allBootcamps });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

/*
@desc: Get all bootcamps information
@Author: Pawel Borkar
@route: GET /api/v1/bootcamps/:id
@access: Public
*/
const getSingleBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return json.status(404).json({
        success: false,
      });
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    // res.status(400).json({ success: false });
    next(error)
  }
};

/*
@desc: Add a new bootcamp
@Author: Pawel Borkar
@route: POST /api/v1/bootcamp
@access: Private
*/
const createBootcamp = async (req, res) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (egetSingleBootcamprror) {
    res.status(400).json({
      success: false,
      message: 'Invalid Input',
    });
  }
};

/*
@desc: Update a bootcamp
@Author: Pawel Borkar
@route: PUT /api/v1/bootcamp/:id
@access: Private
*/
const updateBootcamp = async (req, res) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return res.status(400).json({ success: false });
  }

  res.status(200).json({ success: true, data: bootcamp });
};

/*
@desc: Delete a bootcamp from catalogue
@Author: Pawel Borkar
@route: DELETE /api/v1/bootcamp/:id
@access: Private
*/
const deleteBootcamp = async (req, res) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id );

  if (!bootcamp) {
    return res.status(400).json({ success: false });
  }

  res.status(200).json({ success: true, data: bootcamp });
};

export {
  getAllBootcamps,
  getSingleBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
};
