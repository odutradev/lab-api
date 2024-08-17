import jwt from "jsonwebtoken";
import log from 'gulog';

import { sendError } from "../app.js";

const auth = (req, res, next) => {

  var token = req.header('authorization');
  var company = req.header('company');
  if (!token) return sendError(res, 'no_token');

  try {
    jwt.verify(token, process.env.JWT, (error, decoded) => {
      if (error) return sendError(res, 'token_is_not_valid');
        req.userID = decoded.id;
        req.role = decoded.role;
        req.companyID = company;
        next();
    });
  } catch (err) {
    log.error(`Autenticação não autorizada:`);
    console.log(err);
    return sendError(res, 'internal_error');
  }
};

export default auth;