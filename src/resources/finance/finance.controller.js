import { handleRequest } from "../../app.js";
import Service from "./finance.service.js";

export default class Controller {
	service = new Service();
	
	updateAccountById = async (req, res) => handleRequest(req, res, this.service.updateAccountById);
	deleteAccountById = async (req, res) => handleRequest(req, res, this.service.deleteAccountById);
	createTransaction = async (req, res) => handleRequest(req, res, this.service.createTransaction);
	getAccountById = async (req, res) => handleRequest(req, res, this.service.getAccountById);
	createAccount = async (req, res) => handleRequest(req, res, this.service.createAccount);
	getAccounts = async (req, res) => handleRequest(req, res, this.service.getAccounts);

};