const logger = require("../utils/logger");
const ERROR_CODES = require("../constants/errorCodes");

const errorHandler = (err, req, res) => {
  logger.error(
    `${req.method} ${req.originalUrl} - ${err.message} - Status: ${err.status || 500}`,
  );

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    code: err.code || ERROR_CODES.VALIDATION.GENERAL,
  });
};

module.exports = errorHandler;
