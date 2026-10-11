
import mongoose from "mongoose";

import User from "../models/user.model.js";
import { verifyAccessToken } from "../utils/token.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

/*
 * Authentication Middleware
 *
 * 1. Extract JWT from HTTP-only cookie
 * 2. Verify the JWT
 * 3. Extract user ID from token
 * 4. Find user in MongoDB
 * 5. Check account status
 * 6. Attach user to req.user
 */

export const authenticate = asyncHandler(
    async (req, res, next) => {

        // Step 1: Extract token
        const token = req.cookies?.accessToken;

        if (!token) {
            throw new ApiError(
                401,
                "Authentication required. Please login."
            );
        }

        // Step 2: Verify JWT signature and expiry
        const decoded = verifyAccessToken(token);

        // Step 3: Validate user ID from JWT
        if (
            typeof decoded.sub !== "string" ||
            !mongoose.isObjectIdOrHexString(decoded.sub)
        ) {
            throw new ApiError(
                401,
                "Invalid authentication token"
            );
        }

        // Step 4: Find current user in MongoDB
        const user = await User.findById(decoded.sub);

        if (!user) {
            throw new ApiError(
                401,
                "User account no longer exists"
            );
        }

        // Step 5: Check whether account is active
        if (!user.isActive) {
            throw new ApiError(
                403,
                "Your account is deactivated"
            );
        }

        // Step 6: Attach safe user details to request
        req.user = user.toSafeObject();

        // Step 7: Continue to next middleware/controller
        next();
    }
);

export default authenticate;
