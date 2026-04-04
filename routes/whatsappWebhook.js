const express = require("express");
const router = express.Router();
const {
  handleIncomingMessage,
} = require("../controllers/whatsappController");

// Twilio sends ONLY POST requests
router.post("/", handleIncomingMessage);

module.exports = router;
