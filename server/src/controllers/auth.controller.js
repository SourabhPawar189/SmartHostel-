
import * as authService from "../services/auth.service.js";

import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import env from "../config/env.js";

// Cookie configuration
const ACCESS_TOKEN_COOKIE = "accessToken";

const accessTokenCookieOptions = {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60 * 1000,
};

// Register a new student
export const register = asyncHandler(async (req, res) => {
    const user = await authService.registerStudent(req.body);

    return sendSuccess(res, {
        statusCode: 201,
        message: "Student registered successfully",
        data: { user },
    });
});

// Login an existing user
export const login = asyncHandler(async (req, res) => {
    const { user, accessToken } = await authService.loginUser(
        req.body
    );

    res.cookie(
        ACCESS_TOKEN_COOKIE,
        accessToken,
        accessTokenCookieOptions
    );

    return sendSuccess(res, {
        statusCode: 200,
        message: "Login successful",
        data: { user },
    });
});
