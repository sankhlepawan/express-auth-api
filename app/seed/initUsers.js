const bcrypt = require("bcryptjs");
const db = require("../models");
const logger = require("../utils/logger");

const initUsers = async (roleInstances) => {
  const defaultUsers = [
    {
      username: "superadmin",
      email: "superadmin@example.com",
      password: "superadmin123",
      roles: [roleInstances["super_admin"]],
    },
    {
      username: "admin",
      email: "admin@example.com",
      password: "admin123",
      roles: [roleInstances["admin"]],
    },
  ];

  for (const { username, email, password, roles } of defaultUsers) {
    const [user, created] = await db.user.findOrCreate({
      where: { email },
      defaults: {
        username,
        email,
        password: bcrypt.hashSync(password, 8),
      },
    });

    if (created) {
      await user.setRoles(roles);
      logger.info(`✅ Created user: ${email}`);
    } else {
      logger.warn(`ℹ️ User already exists: ${email}`);
    }
  }

  console.log("✅ Default users initialized");
};

module.exports = initUsers;
