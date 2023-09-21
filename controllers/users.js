import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';
import User from '../models/User.js';

/*
@desc: Get all users
@Author: Pawel Borkar
@route: GET /api/v1/users
@access: Private/Admin
*/
const getAllUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

/*
@desc: Get single user
@Author: Pawel Borkar
@route: GET /api/v1/users/:id
@access: Private/Admin
*/
const getUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) {
    return next(
      new ErrorResponse(`User with an id of ${id} doesn't exists.`, 404)
    );
  }
  next();

  res.status(200).json({
    success: true,
    data: user,
  });
});

/*
@desc: Create user
@Author: Pawel Borkar
@route: POST /api/v1/users/
@access: Private/Admin
*/
const createUser = asyncHandler(async (req, res, next) => {
  const userDetails = req.body;
  const user = await User.create(userDetails);

  res.status(201).json({
    success: true,
    message: 'User created successfully.',
    data: user,
  });
});

/*
@desc: Update user
@Author: Pawel Borkar
@route: PUT /api/v1/users/:id
@access: Private/Admin
*/
const updateUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const userDetails = req.body;

  let user = await User.findById(id);

  if (!user) {
    return next(
      new ErrorResponse(`User with an id of ${id} doesn't exists.`, 404)
    );
  }

  user = await User.findOneAndUpdate(id, userDetails, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'User updated successfully.',
    data: user,
  });
});

/*
@desc: Delete user
@Author: Pawel Borkar
@route: DELETE /api/v1/users/:id
@access: Private/Admin
*/
const deleteUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  let user = await User.findById(id);

  if (!user) {
    return next(
      new ErrorResponse(`User with an id of ${id} doesn't exists.`, 404)
    );
  }
  await User.findOneAndDelete(id);

  res.status(200).json({
    success: true,
    message: `User: ${user.username} deleted successfully`,
    data: [],
  });
});

export { getAllUsers, getUser, createUser, updateUser, deleteUser };
