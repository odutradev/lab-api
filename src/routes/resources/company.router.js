import { Router } from "express";

import companyController from "../../resources/company/company.controller.js";

const service = new companyController();
const companyRouter = Router();

companyRouter.get("/get/public", service.getPublicCompanies);
companyRouter.get("/users", service.getCompanyUsers);
companyRouter.post("/create", service.createCompany);
companyRouter.put("/update", service.updateCompany);
companyRouter.get("/get", service.getCompany);

export default companyRouter;