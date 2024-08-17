import { handleRequest } from "../../app.js";
import Service from "./users.service.js";

export default class Controller {
	service = new Service();
	
	validateResetPasswordCode = async (req, res) => handleRequest(req, res, this.service.validateResetPasswordCode);
	requestResetPassword = async (req, res) => handleRequest(req, res, this.service.requestResetPassword);
	signIn = async (req, res) => handleRequest(req, res, this.service.signIn);
	update = async (req, res) => handleRequest(req, res, this.service.update);
	signUp = async (req, res) => handleRequest(req, res, this.service.signUp);
	secret = async (req, res) => handleRequest(req, res, this.service.secret);
	me = async (req, res) => handleRequest(req, res, this.service.me);
}
