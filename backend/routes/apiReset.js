const express = require("express");
const router = express.Router();
const { forgotPassword } = require("../controllers/forgotPassword.controller");
const { resetPassword } = require("../controllers/resetPassword.controller");

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

module.exports = router;