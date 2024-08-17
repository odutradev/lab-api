import { Router } from "express";

import usersController from "../../resources/admin/admin.controllers.js";

const service = new usersController();
const adminRouter = Router();

adminRouter.delete("/user/delete/:userID", service.deleteUser);
adminRouter.put("/user/update/:userID", service.updateUser);
adminRouter.get("/user/get-all", service.getAllUsers);
adminRouter.get("/user/get/:userID", service.getUser);

export default adminRouter;