const mongoose = require("mongoose");

const whatsappSessionSchema = new mongoose.Schema(
  {
    phone: { type: String, unique: true },
    stage: {
      type: String,
      enum: ["idle", "showing_workers", "awaiting_booking"],
      default: "idle",
    },
    selectedSkill: String,
    selectedWorkerId: mongoose.Schema.Types.ObjectId,
    lastWorkerList: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Worker" },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("WhatsAppSession", whatsappSessionSchema);
