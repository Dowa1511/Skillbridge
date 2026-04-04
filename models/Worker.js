const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

const WorkerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    profession: String,

    experience: {
      type: Number,
      default: 0,
    },

    hourlyRate: {
      type: Number,
      default: 0,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        default: [73.8567, 18.5204], // Pune default
      },
      city: String,
      area: String,
    },

    availability: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    // ⭐⭐⭐⭐⭐ RATINGS
    reviews: [ReviewSchema],

    averageRating: {
      type: Number,
      default: 0,
    },

    workingHours: {
      start: { type: String, default: "09:00" },
      end: { type: String, default: "17:00" },
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create a 2dsphere index for location to support geospatial queries
WorkerSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Worker", WorkerSchema);