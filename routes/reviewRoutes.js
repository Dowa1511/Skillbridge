const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createReview,
  getWorkerReviews,
  getReviewableBookings,
} = require("../controllers/reviewController");

// ⭐ Customer submits review (body bookingId)
router.post(
  "/",
  protect,
  authorize("customer", "worker"),
  createReview
);

// ⭐ Customer submits review (path bookingId, optional)
router.post(
  "/:bookingId",
  protect,
  authorize("customer", "worker"),
  createReview
);

// ⭐ Public – get reviews of a worker
router.get("/worker/:workerId", getWorkerReviews);

// ⭐ Customer – get bookings available for review
router.get(
  "/reviewable",
  protect,
  authorize("customer", "worker"),
  getReviewableBookings
);

module.exports = router;