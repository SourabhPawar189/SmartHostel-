import app from "./app.js";
import connectDB from "./config/db.js";
import env from "./config/env.js";

let server;

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(env.port, () => {
      console.log(
        `Server running on http://localhost:${env.port}`
      );
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

const shutdownServer = (signal) => {
  console.log(`${signal} received. Shutting down...`);

  if (!server) {
    process.exit(0);
  }

  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => {
  shutdownServer("SIGTERM");
});

process.on("SIGINT", () => {
  shutdownServer("SIGINT");
});

startServer();