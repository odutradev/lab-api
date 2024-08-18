import { Router } from "express";

import spaceController from "../../resources/space/space.controller.js";

const service = new spaceController();
const spaceRouter = Router();

spaceRouter.post("/create", service.createSpace);


export default spaceRouter;