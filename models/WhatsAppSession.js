const mongoose = require("mongoose");

const whatsappSessionSchema = new mongoose.Schema(
  {
    phone: { type: String, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: { type: String, enum: ["customer", "worker"] },
    stage: {
      type: String,
      enum: [
        "idle",
        "WAITING_SERVICE",
        "WAITING_CUSTOM_SERVICE",
        "WAITING_LOCATION",
        "SHOWING_WORKERS",
        "WAITING_WORKER_RESPONSE",
        "WAITING_REVIEW"
      ],
      default: "idle",
    },
    selectedSkill: String,
    currentBookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    lastWorkerResults: [
      {
        workerId: { type: mongoose.Schema.Types.ObjectId, ref: "Worker" },
        rank: Number
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("WhatsAppSession", whatsappSessionSchema);
