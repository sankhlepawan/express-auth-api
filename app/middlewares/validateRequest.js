const { validationResult } = require("express-validator");
const ERROR_CODES = require("../constants/errorCodes");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
        code: mapErrorCode(err),
      })),
    });
  }
  next();
};

const mapErrorCode = (err) => {
  const field = err.param;
  const msg = err.msg.toLowerCase();

  if (field === "username" && msg.includes("required"))
    return ERROR_CODES.VALIDATION.REQUIRED_USERNAME;
  if (field === "username") return ERROR_CODES.VALIDATION.INVALID_USERNAME;

  if (field === "email") return ERROR_CODES.VALIDATION.INVALID_EMAIL;

  if (field === "password" && msg.includes("required"))
    return ERROR_CODES.VALIDATION.REQUIRED_PASSWORD;
  if (field === "password") return ERROR_CODES.VALIDATION.INVALID_PASSWORD;

  return ERROR_CODES.VALIDATION.GENERAL;
};

module.exports = validateRequest;
