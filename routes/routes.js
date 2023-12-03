const express = require("express");
const { defaultCall, userRoute, backout } = require("../controllers/userController");
const router = express.Router();

router.get("/", defaultCall);

router.get("/user",userRoute)

router.all("*",backout)

module.exports = router