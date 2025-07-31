// server/middleware/errorHandler.js
import mongoose from "mongoose";

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.error("Error", err.stack);

  // Handle Mongoose CastError (invalid ID)
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = {
      success: false,
      message,
      statusCode: 404,
    };
  }

  // Handle Mongoose Validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = {
      success: false,
      message,
      statusCode: 400,
    };
  }

  // Handle Mongoose Duplicate Key (11000)
  if (err.code === 11000) {
    const message = "Email or phone already in use";
    error = {
      success: false,
      message,
      statusCode: 400,
    };
  }

  // Handle wrong JWT
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token";
    error = {
      success: false,
      message,
      statusCode: 401,
    };
  }

  // Handle expired JWT
  if (err.name === "TokenExpiredError") {
    const message = "Token has expired";
    error = {
      success: false,
      message,
      statusCode: 401,
    };
  }

  // Default status code
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;