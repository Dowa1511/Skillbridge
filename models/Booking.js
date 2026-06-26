const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    },

    profession: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    price: {
      type: Number,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },

    completedAt: {
      type: Date,
    },

    cancellationReason: {
      type: String,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled", "waiting_for_otp"],
      default: "pending",
    },

    completionOTP: {
      type: String,
      default: null,
    },

    otpVerified: {
      type: Boolean,
      default: false,
    },

    otpGeneratedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);