import { Router } from "express";

import spaceController from "../../resources/space/space.controller.js";

const service = new spaceController();
const spaceRouter = Router();

spaceRouter.put("/update", service.updateSpace);
spaceRouter.post("/create", service.createSpace);
spaceRouter.get("/users", service.getSpaceUsers);
spaceRouter.get("/get", service.getSpace);


export default spaceRouter;