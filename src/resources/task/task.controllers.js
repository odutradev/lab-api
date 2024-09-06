import { handleRequest } from "../../app.js";
import Service from "./task.service.js";

export default class Controller {
	service = new Service();
	
	getTaskById = async (req, res) => handleRequest(req, res, this.service.getTaskById);
	createTask = async (req, res) => handleRequest(req, res, this.service.createTask);
	updateTask = async (req, res) => handleRequest(req, res, this.service.updateTask);
	deleteTask = async (req, res) => handleRequest(req, res, this.service.deleteTask);
	getTasks = async (req, res) => handleRequest(req, res, this.service.getTasks);
	
}
