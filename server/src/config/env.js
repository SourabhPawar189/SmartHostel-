import dotenv from "dotenv";

dotenv.config();

const requiredEnvVariables = [
  "MONGODB_URI",
  "JWT_SECRET",
];

for (const name of requiredEnvVariables) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

const env = {
  port: Number(process.env.PORT) || 5000,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
};

export default env;