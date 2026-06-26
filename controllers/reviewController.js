const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Worker = require("../models/Worker");
const User = require("../models/User");
const sendWhatsApp = require("../utils/sendWhatsApp");

exports.createReview = async (req, res) => {
  try {
    const payloadBookingId = req.body.bookingId || req.params.bookingId;
    const { rating, comment } = req.body;

    if (!payloadBookingId || !rating) {
      return res.status(400).json({ message: "Missing required fields (bookingId, rating)" });
    }

    const booking = await Booking.findById(payloadBookingId)
      .populate("worker")
      .populate("customer");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.customer._id.toString() !== req.user._id.toString()) {
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
      worker: booking.worker._id,
      customer: req.user._id,
      rating,
      comment,
    });

    // ===============================
    // WHATSAPP NOTIFICATIONS
    // ===============================
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
    const stars = "⭐".repeat(Number(rating));

    // Thank the customer
    try {
      await sendWhatsApp(
        booking.customer.phone,
        `🙏 *Thank you for your review!*\n\n` +
        `You rated your ${booking.worker.profession}: ${stars} (${rating}/5)\n\n` +
        `${comment ? `"${comment}"\n\n` : ""}` +
        `Your feedback helps workers improve and helps other customers make better decisions. 💙\n\n` +
        `Book more services anytime:\n${FRONTEND_URL}/customer/dashboard`
      );
    } catch (e) {
      console.warn("Review thank-you WhatsApp skipped:", e.message);
    }

    // Notify the worker
    try {
      const workerUser = await User.findById(booking.worker.user);
      if (workerUser?.phone) {
        await sendWhatsApp(
          workerUser.phone,
          `🌟 *New Review Received!*\n\n` +
          `${stars} *${rating}/5 stars*\n` +
          `${comment ? `"${comment}"\n` : ""}` +
          `From: ${booking.customer.name}\n\n` +
          `Keep up the great work! View your profile:\n${FRONTEND_URL}/workers/${booking.worker._id}`
        );
      }
    } catch (e) {
      console.warn("Review worker notification WhatsApp skipped:", e.message);
    }

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