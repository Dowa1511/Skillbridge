const express = require("express");
const router = express.Router();
const { signup, login, verify, updateProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify", protect, verify);
router.put("/update-profile", protect, updateProfile);

module.exports = router;
