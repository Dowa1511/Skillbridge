const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");

const {
  createBooking,
  getWorkerBookings,
  getWorkerPendingBookings,
  updateBookingStatus,
  getCustomerBookings,
  cancelBooking,
  generateOTP,
  verifyOTP,
} = require("../controllers/bookingController");

// ===============================
// CUSTOMER → CREATE BOOKING
// ===============================
router.post(
  "/",
  protect,
  authorize("customer", "worker"),
  createBooking
);

// ===============================
// WORKER → VIEW BOOKINGS
// ===============================
router.get(
  "/worker",
  protect,
  authorize("worker"),
  getWorkerBookings
);

router.get(
  "/worker/pending",
  protect,
  authorize("worker"),
  getWorkerPendingBookings
);

// ===============================
// WORKER → ACCEPT / REJECT / COMPLETE
// ===============================
router.put(
  "/:bookingId/status",
  protect,
  authorize("worker"),
  updateBookingStatus
);

router.post(
  "/generate-otp",
  protect,
  authorize("worker"),
  generateOTP
);

router.post(
  "/verify-otp",
  protect,
  authorize("worker"),
  verifyOTP
);

// Convenience endpoints for mobile/web clients
router.put(
  "/:bookingId/accept",
  protect,
  authorize("worker"),
  (req, res, next) => {
    if (!req.body) req.body = {};
    req.body.status = "accepted";
    next();
  },
  updateBookingStatus
);

router.put(
  "/:bookingId/reject",
  protect,
  authorize("worker"),
  (req, res, next) => {
    if (!req.body) req.body = {};
    req.body.status = "rejected";
    next();
  },
  updateBookingStatus
);

router.put(
  "/:bookingId/complete",
  protect,
  authorize("worker", "customer"),
  (req, res, next) => {
    if (!req.body) req.body = {};
    req.body.status = "completed";
    next();
  },
  updateBookingStatus
);

// ===============================
// CUSTOMER → VIEW BOOKINGS
// ===============================
router.get(
  "/customer",
  protect,
  authorize("customer", "worker"),
  getCustomerBookings
);

// ===============================
// CUSTOMER → CANCEL BOOKING
// ===============================
router.put(
  "/:bookingId/cancel",
  protect,
  authorize("customer", "worker"),
  cancelBooking
);

module.exports = router;