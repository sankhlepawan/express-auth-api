const db = require("../models");
const User = db.user;

const checkRole = (requiredRoles = []) => {
  return async (req, res, next) => {
    try {
      const user = await User.findByPk(req.userId, {
        include: {
          model: db.role,
          as: "roles",
          through: { attributes: [] }, // skip join table
        },
      });

      if (!user) return res.status(404).json({ message: "User not found" });

      const userRoles = user.roles.map((role) => role.name);
      const hasAccess = requiredRoles.some((r) => userRoles.includes(r));

      if (!hasAccess) {
        return res
          .status(403)
          .json({ message: "Access denied: insufficient role" });
      }

      next();
    } catch (err) {
      console.error("Role check error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
};

module.exports = checkRole;
