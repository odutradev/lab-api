import { handleRequest } from "../../app.js";
import Service from "./finance.service.js";

export default class Controller {
	service = new Service();
	
	createAccount = async (req, res) => handleRequest(req, res, this.service.createAccount);

}
