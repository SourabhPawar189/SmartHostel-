
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { generateAccessToken } from "../utils/token.js";

// Shared helpers
const normalizeEmail = (email) => {
  return email.trim().toLowerCase();
};

const validatePassword = (password) => {
  if (typeof password !== "string") {
    throw new ApiError(400, "Password is required");
  }

  if (password.length < 8) {
    throw new ApiError(
      400,
      "Password must contain at least 8 characters"
    );
  }

  // bcrypt processes at most 72 bytes of input
  if (Buffer.byteLength(password, "utf8") > 72) {
    throw new ApiError(
      400,
      "Password cannot exceed 72 bytes"
    );
  }
};

// Register a new student
export const registerStudent = async (userData) => {
  const { name, email, password, phone } = userData ?? {};

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    !name.trim() ||
    !email.trim()
  ) {
    throw new ApiError(
      400,
      "Name and email are required"
    );
  }

  validatePassword(password);

  const normalizedEmail = normalizeEmail(email);

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new ApiError(
      409,
      "Email is already registered"
    );
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    phone,
    role: "student",
  });

  return user.toSafeObject();
};

// Login an existing user
export const loginUser = async (credentials) => {
  const { email, password } = credentials ?? {};

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    throw new ApiError(
      400,
      "Email and password are required"
    );
  }

  const normalizedEmail = normalizeEmail(email);

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+password");

  if (!user) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }

  const isPasswordValid = await user.comparePassword(
    password
  );

  if (!isPasswordValid) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }

  if (!user.isActive) {
    throw new ApiError(
      403,
      "Your account is deactivated"
    );
  }

  const accessToken = generateAccessToken(user._id);

  user.lastLoginAt = new Date();
  await user.save();

  return {
    user: user.toSafeObject(),
    accessToken,
  };
};
