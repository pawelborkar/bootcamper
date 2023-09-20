import crypto from 'node:crypto';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';
import User from '../models/User.js';
import { sendEmail } from '../utils/sendEmail.js';

/*
@desc: Register a new user
@Author: Pawel Borkar
@route: POST /api/v1/auth/signup
@access: Public
*/
const signup = asyncHandler(async (req, res, next) => {
  const { username, name, email, password, role } = req.body;

  // Create User
  const user = await User.create({
    username,
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
});

/*
@desc: Logins an user
@Author: Pawel Borkar
@route: POST /api/v1/auth/signup
@access: Public
*/
const signin = asyncHandler(async (req, res, next) => {
  const { usernameOrEmail, password } = req.body;

  // Validate email and password
  if (!usernameOrEmail || !password) {
    return next(new ErrorResponse(`Please provide a username or email`, 400));
  }

  // Check for a registered user
  const user = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  }).select('+password');

  if (!user) {
    return next(new ErrorResponse(`Invalid credentials.`, 401));
  }

  // Check if the password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse(`Invalid credentials.`, 401));
  }

  sendTokenResponse(user, 200, res);
});

/*
@desc: Get currently logged in user
@Author: Pawel Borkar
@route: POST /api/v1/auth/me
@access: Private
*/
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

/*
@desc: Resets Password
@Author: Pawel Borkar
@route: POST /api/v1/auth/forgot-password
@access: Public
*/
const forgotPassword = asyncHandler(async (req, res, next) => {
  const usernameOrEmail = req.body.usernameOrEmail;

  const user = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });

  if (!user) {
    return next(new ErrorResponse(`User not found.`, 404));
  }

  // Get reset token
  const resetToken = await user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/reset-password/${resetToken}`;

  const message = `You are receiving this email because you has requested the reset of a password. Please make a PUT request to: \n\n ${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Reset Password',
      message,
    });

    res.status(200).json({
      success: true,
      data: `Email Sent`,
    });
  } catch (error) {
    console.error(error);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse(`Email could not be sent.`, 500));
  }
});

/*
@desc: Resets the password
@Author: Pawel Borkar
@route: POST /api/v1/auth/reset-password/:resettoken
@access: Public
*/
const resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(ErrorResponse(`Invalid Token`, 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();


  sendTokenResponse(user,200,res)
});

// Helper for getting token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJWT();

  // Options for cookie generation
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // Enables secure property (https) for production
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};

export { signup, signin, getMe, forgotPassword, resetPassword };
