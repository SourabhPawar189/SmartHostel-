import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import env from "./config/env.js";
import notFoundMiddleware from "./middlewares/notFound.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

/*
 * Security
 */
app.use(helmet());

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

/*
 * Rate limiting
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

/*
 * Request parsing
 */
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/*
 * Logging
 */
if (env.nodeEnv === "development") {
  app.use(morgan("dev"));
}

/*
 * Health check
 */
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Smart Hostel API is running",
    environment: env.nodeEnv,
  });
});

/*
 * 404 handler
 */
app.use(notFoundMiddleware);

/*
 * Global error handler
 */
app.use(errorMiddleware);

export default app;