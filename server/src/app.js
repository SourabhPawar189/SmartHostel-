
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import env from "./config/env.js";

import authRoutes from "./routes/auth.routes.js";

import notFoundMiddleware from "./middlewares/notFound.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

// Security HTTP headers
app.use(helmet());

// Allow React frontend requests
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

// Parse request bodies
app.use(express.json({ limit: "10kb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  })
);

// Parse incoming cookies
app.use(cookieParser());

// Log HTTP requests during development
if (env.nodeEnv === "development") {
  app.use(morgan("dev"));
}

// Health check endpoint
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Smart Hostel API is running",
    environment: env.nodeEnv,
  });
});

// Authentication routes
app.use("/api/v1/auth", authRoutes);

// Handle unknown routes
app.use(notFoundMiddleware);

// Handle application errors
app.use(errorMiddleware);

export default app;
