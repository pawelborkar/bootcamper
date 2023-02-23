/*
Controller: bootcamps
*/

/*
@desc: Get all bootcamps information
@Author: Pawel Borkar
@route: GET /api/v1/bootcamps
@access: Public
*/
const getBootcamps = (req, res) =>
  res.json({ success: true, data: { age: 22, mobile: 8990909090 } });

/*
@desc: Add a new bootcamp
@Author: Pawel Borkar
@route: POST /api/v1/bootcamp
@access: Private
*/
const createBootcamp = (req, res) => {
  const bootcampName = req.body;
  res.json({ success: true, message: `Created new bootcamp: ${bootcampName}` });
};

/*
@desc: Update a bootcamp
@Author: Pawel Borkar
@route: PUT /api/v1/bootcamp/:id
@access: Private
*/
const updateBootcamp = (req, res) =>
  res.json({ success: true, message: `Update bootcamp ${req.param.id}` });

/*
@desc: Delete a bootcamp from catalogue
@Author: Pawel Borkar
@route: DELETE /api/v1/bootcamp/:id
@access: Private
*/
const deleteBootcamp = (req, res) =>
  res.json({ success: true, message: `Delete bootcamp ${req.param.id}` });

export { getBootcamps, createBootcamp, updateBootcamp, deleteBootcamp };
