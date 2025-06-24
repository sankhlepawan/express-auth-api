const db = require("../models");
const logger = require("../utils/logger");
const rolesPermission = require("./rolesPermission");

const initRolesAndPermissions = async () => {
  let roleInstances = {};
  for (const rp of rolesPermission) {
    const [role] = await db.role.findOrCreate({
      where: { name: rp.roleName },
      defaults: { name: rp.roleName },
    });
    roleInstances[rp.roleName] = role;

    const permissions = [];
    for (const name of rp.permissionNames) {
      const [permission] = await db.permission.findOrCreate({
        where: { name },
        defaults: { name },
      });
      permissions.push(permission);
    }

    await roleInstances[rp.roleName].setPermissions(permissions);
  }
  logger.info("✅ Roles and permissions initialized");

  return roleInstances;
};

module.exports = initRolesAndPermissions;
