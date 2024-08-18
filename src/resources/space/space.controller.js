import { handleRequest } from "../../app.js";
import Service from "./space.service.js";

export default class Controller {
	service = new Service();
	
	createSpace = async (req, res) => handleRequest(req, res, this.service.createSpace);

}
