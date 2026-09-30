import mongoose from "mongoose";
import env from "./env.js";

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");

    const connection = await mongoose.connect(env.mongodbUri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;