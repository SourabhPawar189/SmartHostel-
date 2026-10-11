
import { rateLimit } from "express-rate-limit";
import ApiError from "../utils/ApiError.js";

/*
 * Shared rate limiter error handler
 */

const rateLimitHandler = (req, res, next) => {
    return next(
        new ApiError(
            429,
            "Too many requests. Please try again later."
        )
    );
};

/*
 * Registration limiter
 * 5 attempts per IP per hour
 */

export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: rateLimitHandler,
});

/*
 * Login limiter
 * 10 failed attempts per IP per 15 minutes
 */

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    handler: rateLimitHandler,
});
