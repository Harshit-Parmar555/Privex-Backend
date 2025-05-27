import express from "express";
import { createSecret } from "../controllers/secret.controller.js";

const secretRouter = express.Router();

secretRouter.post("/createSecret", createSecret);

export { secretRouter };
