const db = require("../models");
const { sendEmail } = require("../services/email.service");

const User = db.user;
const Role = db.role;
const Permission = db.permission;

// await sendTemplatedEmail({
//   to: user.email,
//   subject: "Welcome to TrackNext!",
//   template: "welcome",
//   context: {
//     username: user.username,
//     appName: "TrackNext"
//   }
// });

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ["id", "username", "email"],
      include: [
        {
          model: Role,
          include: [
            {
              model: Permission,
              attributes: ["name"],
            },
          ],
          attributes: ["name"],
          through: { attributes: [] }, // remove join table data
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let permissions = [];
    const roles = user.roles.map((role) => {
      role.permissions.map((p) => permissions.push(p.name));
      return role.name;
    });

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: roles,
      permissions: permissions,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
