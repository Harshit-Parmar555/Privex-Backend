import express from "express";
import { createSecret } from "../controllers/secret.controller.js";

const secretRouter = express.Router();

secretRouter.post("/createSecter", createSecret);

export { secretRouter };
