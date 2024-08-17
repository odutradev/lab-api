import { sendError } from '../app.js';

const handleRequest = async (req, res, serviceMethod) => {
	try {
		const response = await serviceMethod(req.body, { 
			userID: req.userID,
			companyID: req.companyID
		}, req.params);

		if (response?.error) {
			return sendError(res, response.error);
		}

		return res.status(200).json(response);
	} catch (error) {
		return sendError(res, 'internal_error');
	}
};

export default handleRequest;