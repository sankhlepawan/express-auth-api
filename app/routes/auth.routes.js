const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const { body } = require("express-validator");
const validateRequest = require("../middlewares/validateRequest");

module.exports = function (app) {
  /**
   * @swagger
   * /api/auth/signup:
   *   post:
   *     summary: user signup
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: OK
   *       401:
   *         description: Unauthorized
   */
  app.post(
    "/api/auth/signup",
    [
      body("username")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters"),
      body("email").isEmail().withMessage("Invalid email format"),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
      verifySignUp.checkDuplicateUsernameOrEmail,
      validateRequest,
    ],
    controller.signup,
  );

  /**
   * @swagger
   * /api/auth/signin:
   *   post:
   *     summary: user signin
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: OK
   *       401:
   *         description: Unauthorized
   */
  app.post(
    "/api/auth/signin",
    [
      body("username").notEmpty().withMessage("Username is required"),
      body("password").notEmpty().withMessage("Password is required"),
      validateRequest,
    ],
    controller.signin,
  );

  app.post(
    "/api/auth/forgot-password",
    [
      body("email").notEmpty().withMessage("email is required"),
      validateRequest,
    ],
    controller.forgotPassword,
  );
  app.post(
    "/api/auth/reset-password",
    [
      body("token").notEmpty().withMessage("token is required"),
      body("newPassword").notEmpty().withMessage("New Password is required"),
      validateRequest,
    ],
    controller.resetPassword,
  );
};
