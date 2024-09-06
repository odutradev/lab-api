import { Router } from "express";

import taskController from "../../resources/task/task.controllers.js";

const service = new taskController();
const taskRouter = Router();

taskRouter.put("/create", service.createTask);

export default taskRouter;