import { handleRequest } from "../../app.js";
import Service from "./space.service.js";

export default class Controller {
	service = new Service();
	
	getSpaceUsers = async (req, res) => handleRequest(req, res, this.service.getSpaceUsers);
	createSpace = async (req, res) => handleRequest(req, res, this.service.createSpace);
	updateSpace = async (req, res) => handleRequest(req, res, this.service.updateSpace);
	deleteSpace = async (req, res) => handleRequest(req, res, this.service.deleteSpace);
	getSpace = async (req, res) => handleRequest(req, res, this.service.getSpace);

}
