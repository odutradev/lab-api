import { Router } from "express";

import financeController from "../../resources/finance/finance.controller.js";

const service = new financeController();
const financeRouter = Router();

financeRouter.delete("/transaction/delete/:transactionID", service.deleteTransactionById);
financeRouter.put("/transaction/update/:transactionID", service.updateTransactionsById);
financeRouter.post("/transaction/create/:accountID", service.createTransaction);
financeRouter.delete("/account/delete/:accountID", service.deleteAccountById);
financeRouter.put("/account/update/:accountID", service.updateAccountById);
financeRouter.get("/transactions/:accountID", service.getTransactions);
financeRouter.get("/account/:accountID", service.getAccountById);
financeRouter.post("/account/create", service.createAccount);
financeRouter.get("/accounts/", service.getAccounts);

export default financeRouter;