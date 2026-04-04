// exports.detectIntent = (text) => {
//   if (text === "hi") return "HI";
//   if (["plumber", "electrician", "carpenter"].includes(text)) return "SKILL";
//   if (text.startsWith("book")) return "BOOK";
//   return "UNKNOWN";
// };
const express = require("express");
const router = express.Router();
const { handleTwilioWebhook } = require("../controllers/whatsappController");

// Twilio WhatsApp webhook
router.post("/", handleTwilioWebhook);

module.exports = router;