const express = require("express");
const router = express.Router();

// middlewares
const { authMiddleware } = require("../middlewares/authMiddleware");

// controllers
const { updateUserController } = require("../controllers/updateUserController");

// routes mapping
router.put("/update-user", authMiddleware, updateUserController)

// export routes
module.exports = router;