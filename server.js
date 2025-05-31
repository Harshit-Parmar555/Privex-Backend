// Description: This is the entry point for the server application.

// dotenv configuration
import dotenv from "dotenv";
dotenv.config();

// Importing necessary modules
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// Database connection
import { connectDb } from "./src/db/connect.js";

// Logger configuration
import logger from "./src/utils/logger.js";

// Express app
const app = express();

// Frontend URL configuration
const frontendUrl =
  process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL
    : "http://localhost:5173";

// Middlewares
app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  })
);
app.use(express.json());
app.use(helmet());

// Morgan logger setup ( currently commented out due to storage issues )
// const morganFormat = ":method :url :status :response-time ms";
// app.use(
//   morgan(morganFormat, {
//     stream: {
//       write: (message) => {
//         const [method, url, status, responseTime] = message.split(" ");
//         const logObject = {
//           method,
//           url,
//           status,
//           responseTime,
//         };
//         logger.info(JSON.stringify(logObject));
//       },
//     },
//   })
// );

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Routes
import { secretRouter } from "./src/routes/secret.route.js";
app.use("/api/v1/secret", secretRouter);

// Global error handler
app.use((err, req, res, next) => {
  logger.error(err.stack || err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

// Port
const PORT = process.env.PORT || 4000;

// App listening
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server started on port ${PORT}`);
      console.log(`server started on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error(error);
    console.log(error);
  });
