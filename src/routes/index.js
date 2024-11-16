import { Router } from "express";

import financeRouter from "./resources/finances.router.js";
import spaceRouter from "./resources/space.router.js";
import adminRouter from "./resources/admin.router.js";
import userRouter from "./resources/user.router.js";
import taskRouter from "./resources/task.router.js";
import hasAdmin from "../middlewares/hasAdmin.js";
import auth from "../middlewares/auth.js";

export const router = Router();

router.get("/ping", (req, res) => {
  res.sendStatus(200);
});

router.use('/admin', [auth, hasAdmin], adminRouter);
router.use('/finance', [auth], financeRouter);
router.use('/space', [auth], spaceRouter);
router.use('/task', [auth], taskRouter);
router.use('/user', userRouter);
