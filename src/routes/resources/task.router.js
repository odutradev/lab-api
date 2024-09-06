import { Router } from "express";

import taskController from "../../resources/task/task.controllers.js";

const service = new taskController();
const taskRouter = Router();

taskRouter.post("/create", service.createTask);
taskRouter.get("/get", service.getTasks);

export default taskRouter;