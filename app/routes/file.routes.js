const {
  ROLE_ADMIN,
  ROLE_SUPER_ADMIN,
  ROLE_CLIENT,
} = require("../constants/constant");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const checkRole = require("../middlewares/roleCheck");
const express = require("express");
const router = express.Router();
const controller = require("../controllers/file.controller");

router.post(
  "/upload",
  [
    checkRole([ROLE_ADMIN, ROLE_SUPER_ADMIN, ROLE_CLIENT]),
    upload.single("file"),
  ],
  controller.uploadExcel,
);

router.get(
  "/download",
  [checkRole([ROLE_ADMIN, ROLE_SUPER_ADMIN, ROLE_CLIENT])],
  controller.downloadExcel,
);

module.exports = router;
