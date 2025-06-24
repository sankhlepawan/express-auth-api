const config = require("../config/db.config.js");
const logger = require("../utils/logger");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  port: config.PORT,
  logging: (msg) => logger.debug(`[SQL] ${msg}`),
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.permission = require("./permission.model.js")(sequelize, Sequelize);

// Then define associations
db.user.belongsToMany(db.role, { through: "user_roles" });
db.role.belongsToMany(db.user, { through: "user_roles" });

db.role.belongsToMany(db.permission, { through: "role_permissions" });
db.permission.belongsToMany(db.role, { through: "role_permissions" });

module.exports = db;
