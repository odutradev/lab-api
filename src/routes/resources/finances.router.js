import { Router } from "express";

import financeController from "../../resources/finance/finance.controller.js";

const service = new financeController();
const financeRouter = Router();

financeRouter.delete("/transaction/delete/:accountID", service.deleteTransactionById);
financeRouter.post("/transaction/create/:accountID", service.createTransaction);
financeRouter.delete("/account/delete/:accountID", service.deleteAccountById);
financeRouter.put("/account/update/:accountID", service.updateAccountById);
financeRouter.get("/account/:accountID", service.getAccountById);
financeRouter.post("/account/create", service.createAccount);
financeRouter.get("/transactions/", service.getTransactions);
financeRouter.get("/accounts/", service.getAccounts);

export default financeRouter;