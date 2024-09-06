import { Router } from "express";

import taskController from "../../resources/task/task.controllers.js";

const service = new taskController();
const taskRouter = Router();

taskRouter.delete("/delete/:taskID", service.deleteTask);
taskRouter.put("/update/:taskID", service.updateTask);
taskRouter.get("/get/:taskID", service.getTaskById);
taskRouter.post("/create", service.createTask);
taskRouter.get("/get", service.getTasks);

export default taskRouter;