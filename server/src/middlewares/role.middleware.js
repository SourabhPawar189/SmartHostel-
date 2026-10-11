
import ApiError from "../utils/ApiError.js";

/*
 * Role-based Authorization Middleware
 *
 * Example:
 * authorizeRoles("admin")
 * authorizeRoles("admin", "warden")
 */

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {

        // User must be authenticated first
        if (!req.user) {
            return next(
                new ApiError(
                    401,
                    "Authentication required"
                )
            );
        }

        // Check whether user role is permitted
        if (!allowedRoles.includes(req.user.role)) {
            return next(
                new ApiError(
                    403,
                    "You do not have permission to access this resource"
                )
            );
        }

        // Authorization successful
        next();
    };
};

export default authorizeRoles;
