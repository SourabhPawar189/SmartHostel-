import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new ApiError(401, 'Unauthorized request: Missing token');
  }

  try {
    const decodedToken = jwt.verify(token, env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid or expired access token');
  }
});
