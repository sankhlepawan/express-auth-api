const db = require("../models");
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  User.findOne({ where: { username: req.body.username } }).then((user) => {
    if (user)
      return res.status(400).send({ message: "Username already in use!" });

    User.findOne({ where: { email: req.body.email } }).then((email) => {
      if (email)
        return res.status(400).send({ message: "Email already in use!" });
      next();
    });
  });
};

const verifySignUp = { checkDuplicateUsernameOrEmail };
module.exports = verifySignUp;
