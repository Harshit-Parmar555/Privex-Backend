import express from "express";
import { createSecret, viewSecret } from "../controllers/secret.controller.js";

const secretRouter = express.Router();

secretRouter.post("/create-secret", createSecret);
secretRouter.get("/get-secret/:uuid", viewSecret);

export { secretRouter };
