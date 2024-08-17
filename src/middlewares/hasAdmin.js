import { sendError } from "../app.js";

const hasAdmin = (req, res, next) => {
  try {
    var role = req.role;
    if (!role || role != 'admin') return sendError(res, 'no_admin');
    next();
  } catch (err) {
    return sendError(res, 'internal_error');
  }
};

export default hasAdmin;