module.exports = rolesPermission = [
  {
    roleName: "super_admin",
    permissionNames: ["read:user", "write:user", "delete:user", "update:user"],
  },
  {
    roleName: "admin",
    permissionNames: ["read:user"],
  },
  {
    roleName: "user",
    permissionNames: ["read:user"],
  },
  {
    roleName: "client",
    permissionNames: ["read:user"],
  },
];
