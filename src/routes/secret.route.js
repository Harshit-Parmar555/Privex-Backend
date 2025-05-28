import express from "express";
import { createSecret, viewSecret } from "../controllers/secret.controller.js";

const secretRouter = express.Router();

secretRouter.post("/create-secret", createSecret);
secretRouter.get("/read-secret/:uuid", viewSecret);

export { secretRouter };
