import { handleRequest } from "../../app.js";
import Service from "./company.service.js";

export default class Controller {
	service = new Service();
	
	getPublicCompanies = async (req, res) => handleRequest(req, res, this.service.getPublicCompanies);
	getCompanyUsers = async (req, res) => handleRequest(req, res, this.service.getCompanyUsers);
	createCompany = async (req, res) => handleRequest(req, res, this.service.createCompany);
	updateCompany = async (req, res) => handleRequest(req, res, this.service.updateCompany);
	getCompany = async (req, res) => handleRequest(req, res, this.service.getCompany);
}
