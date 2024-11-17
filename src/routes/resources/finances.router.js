import { Router } from "express";

import financeController from "../../resources/finance/finance.controller.js";

const service = new financeController();
const financeRouter = Router();

financeRouter.get("/account/:accountID", service.getAccountById);
financeRouter.post("/account/create", service.createAccount);
financeRouter.get("/accounts/", service.getAccounts);

export default financeRouter;