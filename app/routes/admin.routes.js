const checkRole = require("../middlewares/roleCheck");
const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin/super admin dashboard
 *     tags: [Users]
 *     security:
 *       - accessToken: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Unauthorized
 */
router.get("/dashboard", [checkRole(["admin", "super_admin"])], (req, res) => {
  res.status(200).send("Welcome to admin dashboard");
});

module.exports = router;
