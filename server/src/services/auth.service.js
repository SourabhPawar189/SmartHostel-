
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

import {
  generateAccessToken,
} from "../utils/token.js";

/*
 * REGISTER STUDENT
 */

export const registerStudent = async (userData) => {
  const {
    name,
    email,
    password,
    phone,
  } = userData;

  // Check whether email already exists
  const existingUser = await User.exists({ email });

  if (existingUser) {
    throw new ApiError(
      409,
      "Email is already registered"
    );
  }

  // Create the student
  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: "student",
  });

  // Password is hashed by the model's pre-save hook
  return user.toSafeObject();
};

/*
 * LOGIN USER
 */

export const loginUser = async (credentials) => {
  const { email, password } = credentials;

  // Explicitly fetch password hash
  const user = await User.findOne({
    email,
  }).select("+password");

  // Use generic errors for failed authentication
  if (!user) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }

  // Compare entered password with stored hash
  const isPasswordValid = await user.comparePassword(
    password
  );

  if (!isPasswordValid || !user.isActive) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }

  // Generate access token
  const accessToken = generateAccessToken(user._id);

  // Update last successful login
  user.lastLoginAt = new Date();
  await user.save();

  return {
    user: user.toSafeObject(),
    accessToken,
  };
};
