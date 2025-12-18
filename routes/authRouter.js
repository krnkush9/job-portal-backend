const express = require("express");
const router = express.Router();

// controller
const { signUpController } = require("../controllers/signUpController");
const { loginController } = require("../controllers/loginController");

// router mapping with controller
router.post("/sign-up", signUpController)
router.post("/login", loginController)

module.exports = router;