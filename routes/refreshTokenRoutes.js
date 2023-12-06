const express = require("express")
const router = express.Router()
const refreshTokenController = require("../controllers/refreshTokenController")
const ROLES_LIST = require("../config/rolesList");
const verifyRoles = require("../middleware/verifyRoles")
router.get("/",verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Editor,ROLES_LIST.User), refreshTokenController.handleRefreshToken)

module.exports = router