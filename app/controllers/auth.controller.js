const db = require("../models");
const config = require("../config/auth.config");
const ERROR_CODES = require("../constants/errorCodes");
const SUCCESS_CODES = require("../constants/successCodes");
const { sendEmail } = require("../services/email.service");
const crypto = require("crypto");

const User = db.user;
const Role = db.role;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const role = await Role.findOne({ where: { name: "user" } });
    await user.setRoles([role]);

    res.send({ message: "User registered successfully!" });
  } catch (err) {
    res
      .status(500)
      .send({ message: err.message, code: ERROR_CODES.SERVER.INTERNAL_SERVER });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.body.username } });
    if (!user)
      return res.status(404).json({
        message: "User not found",
        code: ERROR_CODES.AUTH.USER_NOT_FOUND,
      });

    const isPasswordValid = bcrypt.compareSync(
      req.body.password,
      user.password,
    );
    if (!isPasswordValid)
      return res.status(401).json({
        accessToken: null,
        message: "Invalid username or password!",
        code: ERROR_CODES.AUTH.INVALID_CREDENTIALS,
      });

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400,
    });
    const roles = await user.getRoles();

    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: roles.map((role) => "ROLE_" + role.name.toUpperCase()),
      accessToken: token,
    });
  } catch (err) {
    res
      .status(500)
      .send({ message: err.message, code: ERROR_CODES.SERVER.INTERNAL_SERVER });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await db.user.findOne({ where: { email } });

  if (!user)
    return res.status(404).json({
      message: "User not found",
      code: ERROR_CODES.AUTH.USER_NOT_FOUND,
    });

  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 1000 * 60 * 15; // 15 min
  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  // console.log(resetLink);
  try {
    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      template: "reset-password",
      context: {
        username: user.username,
        resetLink,
      },
    });
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
  }

  res.json({ message: "Password reset link sent" });
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  const user = await db.user.findOne({
    where: {
      resetToken: token,
      resetTokenExpiry: { [Op.gt]: Date.now() },
    },
  });

  if (!user)
    return res.status(400).json({
      message: "Token is invalid or expired",
      code: ERROR_CODES.AUTH.INVALID_TOKEN,
    });

  user.password = bcrypt.hashSync(newPassword, 8);
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await user.save();

  res.status(200).json({
    message: "Password updated successfully",
    code: SUCCESS_CODES.AUTH.PASSWORD_RESET_SUCCESS,
  });
};
