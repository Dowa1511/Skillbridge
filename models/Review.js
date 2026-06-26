const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true, // 1 review per booking
    },

    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

ReviewSchema.statics.calcAverageRatings = async function (workerId) {
  const stats = await this.aggregate([
    {
      $match: { worker: workerId },
    },
    {
      $group: {
        _id: "$worker",
        totalReviews: { $sum: 1 },
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  const Worker = mongoose.model("Worker");

  if (stats.length > 0) {
    await Worker.findByIdAndUpdate(workerId, {
      totalReviews: stats[0].totalReviews,
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
    });
  } else {
    await Worker.findByIdAndUpdate(workerId, {
      totalReviews: 0,
      averageRating: 0,
    });
  }
};

ReviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.worker);
});

// For findByIdAndDelete
ReviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRatings(doc.worker);
  }
});

module.exports = mongoose.model("Review", ReviewSchema);