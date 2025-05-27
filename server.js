import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

// database connection
import { connectDb } from "./src/db/connect.js";

// express app
const app = express();

const frontendUrl =
  process.env.FRONTEND_URL == "production"
    ? process.env.FRONTEND_URL
    : "http://localhost:5173";

// middleware
app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  })
);
app.use(express.json());

// Logger config
import morgan from "morgan";
import logger from "./src/utils/logger.js";

// Commented out morgan logger format due to storage issue
const morganFormat = ":method :url :status :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

// Port
const PORT = process.env.PORT || 4000;

// Routes
import { secretRouter } from "./src/routes/secret.route.js";
app.use("/api/v1/secret", secretRouter);

// App listening
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server started on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
