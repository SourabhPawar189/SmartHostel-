import env from "../config/env.js";
import ApiError from "../utils/ApiError.js";

const errorMiddleware = (err, req, res, next) => {
  let error = err;

  /*
   * Mongoose validation error
   */
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((item) => ({
      field: item.path,
      message: item.message,
    }));

    error = new ApiError(
      400,
      "Validation failed",
      errors
    );
  }

  /*
   * MongoDB duplicate key error
   */
  if (err.code === 11000) {
    const fields = Object.keys(err.keyValue || {});

    error = new ApiError(
      409,
      `Duplicate value for: ${fields.join(", ")}`
    );
  }

  /*
   * Invalid MongoDB ObjectId
   */
  if (err.name === "CastError") {
    error = new ApiError(
      400,
      `Invalid value for field: ${err.path}`
    );
  }

  const statusCode = error.statusCode || 500;

  const response = {
    success: false,
    message:
      error.message || "Internal server error",
  };

  if (error.errors?.length) {
    response.errors = error.errors;
  }

  /*
   * Don't expose stack traces in production
   */
  if (env.nodeEnv === "development") {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};

export default errorMiddleware;