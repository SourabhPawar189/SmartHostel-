
import { z } from "zod";

/*
 * Shared field validation rules
 */

const emailSchema = z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email());

const passwordSchema = z
    .string()
    .min(8, "Password must have at least 8 characters")
    .max(128, "Password is too long")
    .refine(
        (password) =>
            Buffer.byteLength(password, "utf8") <= 72,
        {
            message: "Password cannot exceed 72 bytes",
        }
    );

/*
 * Student registration validation
 */

export const registerSchema = z.strictObject({
    name: z
        .string()
        .trim()
        .min(2, "Name must have at least 2 characters")
        .max(100, "Name cannot exceed 100 characters"),

    email: emailSchema,

    password: passwordSchema,

    phone: z
        .string()
        .trim()
        .regex(
            /^\+?[0-9]{10,15}$/,
            "Phone must contain 10 to 15 digits, optionally starting with +"
        )
        .optional(),
});

/*
 * Login validation
 */

export const loginSchema = z.strictObject({
    email: emailSchema,

    password: z
        .string()
        .min(1, "Password is required")
        .max(128, "Password is too long"),
});
