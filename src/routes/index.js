import { Router } from "express";

import spaceRouter from "./resources/space.router.js";
import adminRouter from "./resources/admin.router.js";
import userRouter from "./resources/user.router.js";
import hasAdmin from "../middlewares/hasAdmin.js";
import auth from "../middlewares/auth.js";

export const router = Router();

router.get("/ping", (req, res) => {
  res.sendStatus(200);
});

router.use('/admin', [auth, hasAdmin], adminRouter);
router.use('/space', [auth], spaceRouter);
router.use('/user', userRouter);