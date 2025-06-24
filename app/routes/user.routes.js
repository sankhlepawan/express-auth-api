const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");

router.get("/profile", controller.getProfile);
// router.post("/update", controller.updateUser);

module.exports = router;
