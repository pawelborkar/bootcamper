import ErrorResponse from "../utils/errorResponse.js";

const errorHandler = (err, _req, res, _next) => {
  let error = { ...err };

  error.message = err.message;
  console.log(err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found.`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = `${JSON.stringify(err.keyValue)} already exists.`;
    error = new ErrorResponse(message, 400);
  }

  // Mongooose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Internal Server Error",
  });
};

export default errorHandler;
