
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import ApiError from "./ApiError.js";

export const generateAccessToken = (userId) => {
    return jwt.sign(
        {},
        env.jwtSecret,
        {
            subject: userId.toString(),
            expiresIn: env.jwtExpiresIn,
            algorithm: "HS256",
        }
    );
};

export const verifyAccessToken = (token) => {
    try {
        const payload = jwt.verify(
            token,
            env.jwtSecret,
            {
                algorithms: ["HS256"],
            }
        );

        if (!payload.sub) {
            throw new ApiError(401, "Invalid access token");
        }

        return payload;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        if (error.name === "TokenExpiredError") {
            throw new ApiError(
                401,
                "Access token has expired"
            );
        }

        throw new ApiError(401, "Invalid access token");
    }
};
