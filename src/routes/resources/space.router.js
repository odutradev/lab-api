import { Router } from "express";

import spaceController from "../../resources/space/space.controller.js";

const service = new spaceController();
const spaceRouter = Router();

spaceRouter.post("/invite/accept", service.acceptInvitation);
spaceRouter.put("/update/:spaceID", service.updateSpaceById);
spaceRouter.delete("/delete/:spaceID", service.deleteSpace);
spaceRouter.get("/users/:spaceID", service.getSpaceUsersById);
spaceRouter.post("/invite/deny", service.denyInvitation);
spaceRouter.get("/get/:spaceID", service.getSpaceById);
spaceRouter.post("/invite", service.inviteToSpace);
spaceRouter.post("/create", service.createSpace);
spaceRouter.get("/users", service.getSpaceUsers);
spaceRouter.put("/update", service.updateSpace);
spaceRouter.put("/leave", service.leaveSpace);
spaceRouter.get("/get", service.getSpace);


export default spaceRouter;