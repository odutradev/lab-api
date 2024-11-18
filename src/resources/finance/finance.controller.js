import { handleRequest } from "../../app.js";
import Service from "./finance.service.js";

export default class Controller {
	service = new Service();
	
	updateTransactionsById = async (req, res) => handleRequest(req, res, this.service.updateTransactionsById);
	deleteTransactionById = async (req, res) => handleRequest(req, res, this.service.deleteTransactionById);
	deleteAccountById = async (req, res) => handleRequest(req, res, this.service.deleteAccountById);
	updateAccountById = async (req, res) => handleRequest(req, res, this.service.updateAccountById);
	createTransaction = async (req, res) => handleRequest(req, res, this.service.createTransaction);
	getTransactions = async (req, res) => handleRequest(req, res, this.service.getTransactions);
	getAccountById = async (req, res) => handleRequest(req, res, this.service.getAccountById);
	createAccount = async (req, res) => handleRequest(req, res, this.service.createAccount);
	getAccounts = async (req, res) => handleRequest(req, res, this.service.getAccounts);

};