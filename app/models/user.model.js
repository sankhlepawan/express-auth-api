module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING },
    password: { type: Sequelize.STRING },
    resetToken: {
      type: Sequelize.STRING,
    },
    resetTokenExpiry: {
      type: Sequelize.DATE,
    },
  });

  return User;
};
