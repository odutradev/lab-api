import { handleRequest } from "../../app.js";
import Service from "./users.service.js";

export default class Controller {
	service = new Service();
	
	createUserPayload = async (req, res) => handleRequest(req, res, this.service.createUserPayload);
	signInWithPayload = async (req, res) => handleRequest(req, res, this.service.signInWithPayload);
	signIn = async (req, res) => handleRequest(req, res, this.service.signIn);
	update = async (req, res) => handleRequest(req, res, this.service.update);
	signUp = async (req, res) => handleRequest(req, res, this.service.signUp);
	me = async (req, res) => handleRequest(req, res, this.service.me);
}
