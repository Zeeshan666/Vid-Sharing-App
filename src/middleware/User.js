// customLoggerMiddleware.js
import logger from "../../logger.js";

const customLoggerForUser = (req, res, next) => {
  const user = req.user || {};
  
  // Use an empty object if user is not available
  // Log specific parts of the request and user details
  logger.info(`User: ${JSON.stringify(user)}`);
  next();
};

export default customLoggerForUser;
