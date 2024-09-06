import { handleRequest } from "../../app.js";
import Service from "./task.service.js";

export default class Controller {
	service = new Service();
	
	createTask = async (req, res) => handleRequest(req, res, this.service.createTask);

}
