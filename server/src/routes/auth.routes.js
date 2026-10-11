
import { Router } from "express";

import {
    register,
    login,
} from "../controllers/auth.controller.js";

import authenticate from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

import { sendSuccess } from "../utils/response.js";
import env from "../config/env.js";

const router = Router();

/*
 * PUBLIC ROUTES
 * Authentication not required
 */

router.post("/register", register);

router.post("/login", login);

/*
 * TEMPORARY DEVELOPMENT TEST ROUTES
 * Remove after testing authentication/authorization
 */

if (env.nodeEnv === "development") {

    // Any authenticated user
    router.get(
        "/profile-check",
        authenticate,
        (req, res) => {
            return sendSuccess(res, {
                message: "Authentication successful",
                data: {
                    user: req.user,
                },
            });
        }
    );

    // Only admin and warden
    router.get(
        "/warden-check",
        authenticate,
        authorizeRoles("admin", "warden"),
        (req, res) => {
            return sendSuccess(res, {
                message: "Authorization successful",
                data: {
                    user: req.user,
                },
            });
        }
    );

}

export default router;
