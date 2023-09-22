import jwt from 'jsonwebtoken';
import asyncHandler from './async.js';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the token is present in the request headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Unable to access this route', 401));
  }

  try {
    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(new ErrorResponse('Unable to access this route', 401));
  }
});

// Grant access to the specific roles
const authorize = asyncHandler(async (req, res, next) => {
  const userRole = req.user.role;
  if (!(userRole == 'publisher' || userRole == 'admin')) {
    return next(
      new ErrorResponse(
        `Access Denied: Only publisher or admin can perform this operation`,
        403
      )
    );
  }
  next();
});

// Grant access to the specific roles
const isAdmin = asyncHandler(async (req, res, next) => {
  const userRole = req.user.role;
  if (!(userRole == 'admin')) {
    return next(
      new ErrorResponse(`Access Denied: Only admin can access this route`, 401)
    );
  }
  next();
});

// Grant access to the specific roles
const isUser = asyncHandler(async (req, res, next) => {
  const userRole = req.user.role;
  if (!(userRole == 'user' || userRole == 'admin')) {
    return next(
      new ErrorResponse(
        `Access Denied: Only user or admin can access this route`,
        401
      )
    );
  }
  next();
});

export { protect, authorize, isAdmin, isUser };
