const Review = require("../models/Review");
const Booking = require("../models/Booking");

exports.createReview = async (req, res) => {
  try {
    const payloadBookingId = req.body.bookingId || req.params.bookingId;
    const { rating, comment } = req.body;

    if (!payloadBookingId || !rating) {
      return res.status(400).json({ message: "Missing required fields (bookingId, rating)" });
    }

    const booking = await Booking.findById(payloadBookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to review this booking" });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({ message: "You can only leave a review for fully completed bookings." });
    }

    const existing = await Review.findOne({ booking: payloadBookingId });
    if (existing) {
      return res.status(400).json({ message: "Review already submitted" });
    }

    const review = await Review.create({
      booking: payloadBookingId,
      worker: booking.worker,
      customer: req.user._id,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (err) {
    console.error("Review error:", err);
    res.status(500).json({ message: "Failed to submit review" });
  }
};
exports.getWorkerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ worker: req.params.workerId })
      .populate("customer", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ reviews });
  } catch (err) {
    console.error("Fetch reviews error:", err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

// ===============================
// GET REVIEWABLE BOOKINGS (CUSTOMER)
// ===============================
exports.getReviewableBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      customer: req.user._id,
      status: "completed"
    }).populate("worker", "profession");

    const reviewable = bookings.filter(booking => {
      try {
        const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
        if (isNaN(bookingDateTime.getTime())) return false;
        return new Date() >= bookingDateTime;
      } catch {
        return false;
      }
    });

    res.status(200).json({ reviewable });
  } catch (err) {
    console.error("Fetch reviewable bookings error:", err);
    res.status(500).json({ message: "Failed to fetch reviewable bookings" });
  }
};