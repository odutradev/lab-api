import { handleRequest } from "../../app.js";
import Service from "./space.service.js";

export default class Controller {
	service = new Service();
	
	getSpaceUsersById = async (req, res) => handleRequest(req, res, this.service.getSpaceUsersById);
	acceptInvitation = async (req, res) => handleRequest(req, res, this.service.acceptInvitation);
	updateSpaceById = async (req, res) => handleRequest(req, res, this.service.updateSpaceById);
	denyInvitation = async (req, res) => handleRequest(req, res, this.service.denyInvitation);
	inviteToSpace = async (req, res) => handleRequest(req, res, this.service.inviteToSpace);
	getSpaceUsers = async (req, res) => handleRequest(req, res, this.service.getSpaceUsers);
	getSpaceById = async (req, res) => handleRequest(req, res, this.service.getSpaceById);
	createSpace = async (req, res) => handleRequest(req, res, this.service.createSpace);
	updateSpace = async (req, res) => handleRequest(req, res, this.service.updateSpace);
	deleteSpace = async (req, res) => handleRequest(req, res, this.service.deleteSpace);
	leaveSpace = async (req, res) => handleRequest(req, res, this.service.leaveSpace);
	getSpace = async (req, res) => handleRequest(req, res, this.service.getSpace);

}
