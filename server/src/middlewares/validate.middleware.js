
import ApiError from "../utils/ApiError.js";

/*
 * Reusable request body validation middleware
 *
 * Usage:
 * validate(registerSchema)
 * validate(loginSchema)
 */

const validate = (schema) => {
    return (req, res, next) => {

        const result = schema.safeParse(req.body);

        // Handle invalid request data
        if (!result.success) {
            const errors = result.error.issues.map(
                (issue) => ({
                    field: issue.path.join(".") || "body",
                    message: issue.message,
                })
            );

            return next(
                new ApiError(
                    400,
                    "Request validation failed",
                    errors
                )
            );
        }

        // Store validated and normalized data
        req.body = result.data;

        next();
    };
};

export default validate;
