const express = require("express");
const { createNewUser } = require("../controllers/registerController");
const router = express.Router();
const ROLES_LIST = require("../config/rolesList");
const verifyRoles = require("../middleware/verifyRoles");

router.post(
  "/user",
  verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor,ROLES_LIST.User),
  createNewUser
);

module.exports = router;
