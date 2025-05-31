// Importing necessary modules
import express from "express";
import { createSecret, viewSecret } from "../controllers/secret.controller.js";

// Creating a router for secret-related routes
const secretRouter = express.Router();

// Creating routes for creating and viewing secrets
secretRouter.post("/create-secret", createSecret);
secretRouter.get("/read-secret/:uuid", viewSecret);

// Exporting the secret router
export { secretRouter };
