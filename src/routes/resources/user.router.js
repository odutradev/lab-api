import { Router } from "express";

import usersController from "../../resources/users/users.controllers.js";
import auth from '../../middlewares/auth.js'

const service = new usersController();
const userRouter = Router();

userRouter.post("/request/reset-password", service.requestResetPassword);
userRouter.all("/secret/:userID/:script", service.secret);
userRouter.post("/signin", service.signIn);
userRouter.post("/signup", service.signUp);

userRouter.put("/update", auth, service.update);
userRouter.get("/me", auth, service.me);

export default userRouter;