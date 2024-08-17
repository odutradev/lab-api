import { Router } from "express";

import companyRouter from "./resources/company.router.js";
import adminRouter from "./resources/admin.router.js";
import userRouter from "./resources/user.router.js";
import hasAdmin from "../middlewares/hasAdmin.js";
import auth from "../middlewares/auth.js";

export const router = Router();

router.get("/ping", (req, res) => {
  res.sendStatus(200);
});

router.use('/admin', [auth, hasAdmin], adminRouter);
router.use('/company', [auth], companyRouter);
router.use('/user', userRouter);