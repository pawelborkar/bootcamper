import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';
import User from '../models/User.js';

/*
@desc: Get all bootcamps information
@Author: Pawel Borkar
@route: GET /api/v1/auth/signup
@access: Public
*/
const signup = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create User
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // Create token
  const token = user.getSignedJWT();

  res.status(200).json({
    success: true,
    token,
  });
});

export { signup };
