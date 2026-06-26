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
      default: "",
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
      unique: true,
    },

    profession: {
      type: String,
      default: "Other",
    },

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
        type: [Number],
        default: [73.8567, 18.5204], // Pune
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

    averageRating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    reviews: [ReviewSchema],

    workingHours: {
      start: {
        type: String,
        default: "09:00",
      },
      end: {
        type: String,
        default: "17:00",
      },
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
  {
    timestamps: true,
  }
);

// Ensure valid GeoJSON
WorkerSchema.pre("save", async function () {
  if (
    !this.location ||
    !Array.isArray(this.location.coordinates) ||
    this.location.coordinates.length !== 2
  ) {
    this.location = {
      type: "Point",
      coordinates: [73.8567, 18.5204],
    };
  }
});

// ONLY ONE GEO INDEX
WorkerSchema.index({
  location: "2dsphere",
});

WorkerSchema.index({
  profession: "text",
});

module.exports = mongoose.model("Worker", WorkerSchema);