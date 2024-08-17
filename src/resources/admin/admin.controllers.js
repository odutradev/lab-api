import { handleRequest } from "../../app.js";
import Service from "./admin.service.js";

export default class Controller {
	service = new Service();
	
	getPendingUsers = async (req, res) => handleRequest(req, res, this.service.getPendingUsers);
	getAllUsers = async (req, res) => handleRequest(req, res, this.service.getAllUsers);
	approveUser = async (req, res) => handleRequest(req, res, this.service.approveUser);
	updateUser = async (req, res) => handleRequest(req, res, this.service.updateUser);
	deleteUser = async (req, res) => handleRequest(req, res, this.service.deleteUser);
	getUser = async (req, res) => handleRequest(req, res, this.service.getUser);
}
